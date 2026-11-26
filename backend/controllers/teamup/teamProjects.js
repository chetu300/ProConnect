import mongoose from "mongoose";
import TeamProject from "../../models/TeamProject.js";

const projectStatuses = new Set(["idea", "building", "launched"]);

function parseList(value, fieldName, maxItems = 8) {
  if (value == null || value === "") return { items: [], error: null };
  const rawItems = typeof value === "string" ? value.split(",") : value;

  if (!Array.isArray(rawItems) || rawItems.some((item) => typeof item !== "string")) {
    return { items: [], error: `${fieldName} must be a comma-separated list` };
  }

  const items = [...new Set(rawItems.map((item) => item.trim()).filter(Boolean))];
  if (items.length > maxItems || items.some((item) => item.length > 40)) {
    return { items: [], error: `${fieldName} supports up to ${maxItems} items of 40 characters each` };
  }

  return { items, error: null };
}

function isProjectOwner(project, userId) {
  return project.owner.equals(userId);
}

export async function getTeamProjects(req, res) {
  try {
    const projects = await TeamProject.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("owner", "name username profileImage headline")
      .populate("teamMembers", "name username profileImage headline")
      .populate("requests.user", "name username profileImage headline");
    const currentUserId = req.user._id.toString();

    return res.json(
      projects.map((project) => {
        const result = project.toObject();
        const ownRequest = project.requests.find(
          (request) => request.user?._id?.toString() === currentUserId
        );
        result.myRequestStatus = ownRequest?.status || null;

        if (result.owner?._id?.toString() !== currentUserId) {
          result.requests = [];
        }

        return result;
      })
    );
  } catch (error) {
    console.error("Get team projects failed:", error.message);
    return res.status(500).json({ message: "Could not load project teams" });
  }
}

export async function createTeamProject(req, res) {
  try {
    const body = req.body || {};
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const description =
      typeof body.description === "string" ? body.description.trim() : "";
    const status = body.status || "idea";
    const roles = parseList(body.rolesNeeded, "Roles needed");
    const skills = parseList(body.skills, "Skills");

    if (!title || title.length > 100) {
      return res.status(400).json({ message: "Project title is required (100 characters max)" });
    }
    if (!description || description.length > 1000) {
      return res.status(400).json({ message: "Project description is required (1000 characters max)" });
    }
    if (!projectStatuses.has(status)) {
      return res.status(400).json({ message: "Choose a valid project status" });
    }
    if (roles.error || skills.error) {
      return res.status(400).json({ message: roles.error || skills.error });
    }

    const project = await TeamProject.create({
      owner: req.user._id,
      title,
      description,
      status,
      rolesNeeded: roles.items,
      skills: skills.items,
    });
    await project.populate("owner", "name username profileImage headline");

    return res.status(201).json(project);
  } catch (error) {
    console.error("Create team project failed:", error.message);
    return res.status(500).json({ message: "Could not create project" });
  }
}

export async function requestToJoinProject(req, res) {
  try {
    const body = req.body || {};
    const { projectId } = req.params;
    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await TeamProject.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (isProjectOwner(project, req.user._id)) {
      return res.status(400).json({ message: "You already own this project" });
    }
    if (project.status === "launched") {
      return res.status(409).json({ message: "This project is no longer looking for teammates" });
    }
    if (project.teamMembers.some((memberId) => memberId.equals(req.user._id))) {
      return res.status(409).json({ message: "You are already on this team" });
    }
    if (
      project.requests.some(
        (request) =>
          request.user.equals(req.user._id) &&
          ["pending", "accepted"].includes(request.status)
      )
    ) {
      return res.status(409).json({ message: "You already have an active request for this project" });
    }

    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (message.length > 300) {
      return res.status(400).json({ message: "Your note must be 300 characters or fewer" });
    }

    project.requests.push({ user: req.user._id, message });
    await project.save();

    return res.status(201).json({ message: "Your request to join was sent" });
  } catch (error) {
    console.error("Request to join project failed:", error.message);
    return res.status(500).json({ message: "Could not send join request" });
  }
}

export async function updateTeamProjectStatus(req, res) {
  try {
    const body = req.body || {};
    const { projectId } = req.params;
    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await TeamProject.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (!isProjectOwner(project, req.user._id)) {
      return res.status(403).json({ message: "Only the project owner can update its status" });
    }
    if (!projectStatuses.has(body.status)) {
      return res.status(400).json({ message: "Choose a valid project status" });
    }

    project.status = body.status;
    await project.save();
    return res.json({ message: "Project status updated", status: project.status });
  } catch (error) {
    console.error("Update team project status failed:", error.message);
    return res.status(500).json({ message: "Could not update project status" });
  }
}

export async function reviewJoinRequest(req, res) {
  try {
    const body = req.body || {};
    const { projectId, requestId } = req.params;
    if (!mongoose.isValidObjectId(projectId) || !mongoose.isValidObjectId(requestId)) {
      return res.status(400).json({ message: "Invalid project or request ID" });
    }

    const project = await TeamProject.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (!isProjectOwner(project, req.user._id)) {
      return res.status(403).json({ message: "Only the project owner can review requests" });
    }

    const request = project.requests.id(requestId);
    if (!request || request.status !== "pending") {
      return res.status(404).json({ message: "Pending join request not found" });
    }
    if (!["accept", "decline"].includes(body.action)) {
      return res.status(400).json({ message: "Choose accept or decline" });
    }

    request.status = body.action === "accept" ? "accepted" : "declined";
    if (request.status === "accepted") {
      project.teamMembers.addToSet(request.user);
    }
    await project.save();

    return res.json({ message: `Join request ${request.status}` });
  } catch (error) {
    console.error("Review project join request failed:", error.message);
    return res.status(500).json({ message: "Could not review join request" });
  }
}
