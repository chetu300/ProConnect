import mongoose from "mongoose";

const joinRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, trim: true, maxlength: 300, default: "" },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const teamProjectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    rolesNeeded: [{ type: String, trim: true, maxlength: 40 }],
    skills: [{ type: String, trim: true, maxlength: 40 }],
    status: {
      type: String,
      enum: ["idea", "building", "launched"],
      default: "idea",
    },
    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    requests: [joinRequestSchema],
  },
  { timestamps: true }
);

export default mongoose.model("TeamProject", teamProjectSchema);
