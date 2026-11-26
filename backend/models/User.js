import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    company: { type: String, trim: true },
    location: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    school: { type: String, trim: true },
    degree: { type: String, trim: true },
    field: { type: String, trim: true },
    startYear: { type: String, trim: true },
    endYear: { type: String, trim: true },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 1000, default: "" },
  technologies: [{ type: String, trim: true }],
  projectUrl: { type: String, trim: true, maxlength: 2048, default: "" },
  repositoryUrl: { type: String, trim: true, maxlength: 2048, default: "" },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    headline: { type: String, default: "", trim: true },
    about: { type: String, default: "", trim: true },
    skills: [{ type: String, trim: true }],
    experience: [experienceSchema],
    education: [educationSchema],
    projects: { type: [projectSchema], default: [] },
    profileImage: { type: String, default: "" },
    bannerImage: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
