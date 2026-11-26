import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, Blocks, CircleX, FolderPlus, Rocket, Sparkles, UserRoundPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../lib/axios.js";

const statusLabels = {
  idea: "Idea",
  building: "Building",
  launched: "Launched",
};

const initialForm = {
  title: "",
  description: "",
  rolesNeeded: "",
  skills: "",
  status: "idea",
};

function splitList(value) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BuildWithMePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [joiningProjectId, setJoiningProjectId] = useState("");
  const [joinMessage, setJoinMessage] = useState("");

  const projects = useQuery({
    queryKey: ["team-projects"],
    queryFn: async () => (await api.get("/team-projects")).data,
  });

  const createProject = useMutation({
    mutationFn: (project) => api.post("/team-projects", project),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["team-projects"] }),
  });

  const requestToJoin = useMutation({
    mutationFn: ({ projectId, message }) =>
      api.post(`/team-projects/${projectId}/requests`, { message }),
    onSuccess: () => {
      setJoiningProjectId("");
      setJoinMessage("");
      queryClient.invalidateQueries({ queryKey: ["team-projects"] });
    },
  });

  const reviewRequest = useMutation({
    mutationFn: ({ projectId, requestId, action }) =>
      api.patch(`/team-projects/${projectId}/requests/${requestId}`, { action }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["team-projects"] }),
  });

  const updateStatus = useMutation({
    mutationFn: ({ projectId, status }) =>
      api.patch(`/team-projects/${projectId}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["team-projects"] }),
  });

  const mutationError =
    createProject.error ||
    requestToJoin.error ||
    reviewRequest.error ||
    updateStatus.error;

  function submitProject(event) {
    event.preventDefault();
    createProject.mutate(
      {
        ...form,
        rolesNeeded: splitList(form.rolesNeeded),
        skills: splitList(form.skills),
      },
      {
        onSuccess: () => {
          setForm(initialForm);
          setIsCreating(false);
        },
      }
    );
  }

  function submitJoinRequest(event, projectId) {
    event.preventDefault();
    requestToJoin.mutate({ projectId, message: joinMessage });
  }

  return (
    <div className="space-y-5">
      <section className="card flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-indigo/10 text-brand-indigo">
            <Blocks size={23} fill="currentColor" fillOpacity={0.16} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink-primary sm:text-2xl">Build With Me</h1>
            <p className="mt-1 max-w-2xl text-sm text-ink-secondary">
              Share what you’re making, find a teammate, and turn a class idea into a real project.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary group"
          onClick={() => setIsCreating((current) => !current)}
        >
          {isCreating ? (
            <CircleX size={17} className="fill-current" />
          ) : (
            <FolderPlus size={17} className="transition-transform group-hover:fill-current" />
          )}
          {isCreating ? "Close" : "Start a project"}
        </button>
      </section>

      {isCreating && (
        <form onSubmit={submitProject} className="card gap-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-ink-primary">Share a project</h2>
              <p className="mt-1 text-sm text-ink-secondary">
                Add what you’re building and who would make a great teammate.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline btn-sm group"
              aria-label="Close project form"
              onClick={() => setIsCreating(false)}
            >
              <CircleX size={16} className="transition-transform group-hover:rotate-90 group-hover:fill-current" />
              Close
            </button>
          </div>
          <label className="grid gap-1.5 text-sm font-medium text-ink-primary">
            Project name
            <input
              className="input input-bordered auth-input w-full"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              maxLength={100}
              placeholder="e.g. Campus events finder"
              required
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-ink-primary">
            What are you building?
            <textarea
              className="textarea textarea-bordered auth-input min-h-24 w-full"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              maxLength={1000}
              placeholder="A short overview, what you’ve done so far, or what you want to learn."
              required
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-medium text-ink-primary">
              Teammates you’re looking for
              <input
                className="input input-bordered auth-input w-full"
                value={form.rolesNeeded}
                onChange={(event) => setForm({ ...form, rolesNeeded: event.target.value })}
                placeholder="UI designer, frontend developer"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-ink-primary">
              Skills or tools
              <input
                className="input input-bordered auth-input w-full"
                value={form.skills}
                onChange={(event) => setForm({ ...form, skills: event.target.value })}
                placeholder="React, Figma, research"
              />
            </label>
          </div>
          <label className="grid gap-1.5 text-sm font-medium text-ink-primary sm:max-w-xs">
            Current stage
            <select
              className="select select-bordered auth-input w-full"
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value })}
            >
              <option value="idea">Idea</option>
              <option value="building">Building</option>
            </select>
          </label>
          {createProject.isError && (
            <p role="alert" className="text-sm text-red-600">
              {createProject.error.response?.data?.message || "Could not publish the project."}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="btn btn-primary group" disabled={createProject.isPending}>
              <Rocket size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:fill-current" />
              {createProject.isPending ? "Publishing..." : "Publish project"}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setIsCreating(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {mutationError && !createProject.isError && (
        <p role="alert" className="card p-4 text-sm text-red-600">
          {mutationError.response?.data?.message || "Could not update this project."}
        </p>
      )}
      {projects.isLoading && (
        <p className="card p-6 text-center text-sm text-ink-secondary">Loading projects...</p>
      )}
      {projects.isError && (
        <p role="alert" className="card p-6 text-center text-sm text-red-600">
          Could not load projects. Please try again.
        </p>
      )}

      {projects.data?.length === 0 && !projects.isLoading && (
        <section className="card p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-indigo/10 text-brand-indigo">
            <Sparkles size={22} fill="currentColor" fillOpacity={0.18} />
          </div>
          <h2 className="mt-3 font-semibold text-ink-primary">Your next project team starts here</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-ink-secondary">
            Share a class project, side project, or idea and find students who want to build it with you.
          </p>
        </section>
      )}

      <section className="grid gap-4 lg:grid-cols-2">
        {projects.data?.map((project) => {
          const isOwner = project.owner?._id === user?._id;
          const isOnTeam = project.teamMembers?.some((member) => member._id === user?._id);
          const pendingRequests = project.requests?.filter((request) => request.status === "pending") || [];

          return (
            <article key={project._id} className="card gap-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-ink-secondary">
                    {project.owner?.name || "ProConnect student"} · {formatDate(project.createdAt)}
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-ink-primary">{project.title}</h2>
                </div>
                {isOwner ? (
                  <select
                    className="select select-bordered auth-input select-sm w-32"
                    value={project.status}
                    onChange={(event) =>
                      updateStatus.mutate({ projectId: project._id, status: event.target.value })
                    }
                    aria-label={`Update status for ${project.title}`}
                    disabled={updateStatus.isPending}
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                ) : (
                  <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-brand-indigo">
                    {statusLabels[project.status]}
                  </span>
                )}
              </div>

              <p className="whitespace-pre-wrap text-sm leading-6 text-ink-secondary">
                {project.description}
              </p>

              {project.rolesNeeded?.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-secondary">
                    Looking for
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.rolesNeeded.map((role) => (
                      <span key={role} className="rounded-full bg-brand-purple/10 px-3 py-1 text-xs font-medium text-brand-purple">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
                    <span key={skill} className="badge badge-ghost">{skill}</span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 border-t border-border-subtle pt-3">
                <UserRoundPlus size={16} className="text-brand-indigo" fill="currentColor" fillOpacity={0.16} />
                <span className="text-sm text-ink-secondary">
                  {project.teamMembers?.length || 0} teammate{project.teamMembers?.length === 1 ? "" : "s"}
                </span>
                {project.teamMembers?.map((member) => (
                  <span key={member._id} className="rounded-full bg-surface-bg px-2.5 py-1 text-xs text-ink-primary">
                    {member.name}
                  </span>
                ))}
              </div>

              {isOwner ? (
                <div className="space-y-3 rounded-xl bg-surface-bg p-4">
                  <h3 className="text-sm font-semibold text-ink-primary">
                    Join requests {pendingRequests.length > 0 && `(${pendingRequests.length})`}
                  </h3>
                  {pendingRequests.length === 0 ? (
                    <p className="text-sm text-ink-secondary">No teammate requests yet.</p>
                  ) : (
                    pendingRequests.map((request) => (
                      <div key={request._id} className="rounded-xl border border-border-subtle bg-white p-3">
                        <p className="font-medium text-ink-primary">{request.user?.name}</p>
                        {request.message && (
                          <p className="mt-1 text-sm text-ink-secondary">{request.message}</p>
                        )}
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            disabled={reviewRequest.isPending}
                            onClick={() =>
                              reviewRequest.mutate({
                                projectId: project._id,
                                requestId: request._id,
                                action: "accept",
                              })
                            }
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            disabled={reviewRequest.isPending}
                            onClick={() =>
                              reviewRequest.mutate({
                                projectId: project._id,
                                requestId: request._id,
                                action: "decline",
                              })
                            }
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : isOnTeam ? (
                <p className="rounded-xl bg-brand-indigo/10 p-3 text-sm font-medium text-brand-indigo">
                  You’re on this project team.
                </p>
              ) : project.myRequestStatus === "pending" ? (
                <p className="rounded-xl bg-brand-purple/10 p-3 text-sm font-medium text-brand-purple">
                  Your join request is waiting for a response.
                </p>
              ) : project.status === "launched" ? (
                <p className="text-sm text-ink-secondary">This project has launched and is no longer accepting teammates.</p>
              ) : joiningProjectId === project._id ? (
                <form onSubmit={(event) => submitJoinRequest(event, project._id)} className="grid gap-3">
                  <textarea
                    className="textarea textarea-bordered auth-input w-full"
                    value={joinMessage}
                    onChange={(event) => setJoinMessage(event.target.value)}
                    maxLength={300}
                    placeholder="Add a short note about how you’d like to help (optional)"
                    aria-label="Message to the project owner"
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="btn btn-primary btn-sm" disabled={requestToJoin.isPending}>
                      {requestToJoin.isPending ? "Sending..." : "Send request"}
                    </button>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => setJoiningProjectId("")}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btn-sm self-start group"
                  onClick={() => setJoiningProjectId(project._id)}
                >
                  Join project <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:fill-current" />
                </button>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}
