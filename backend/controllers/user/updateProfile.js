import User from "../../models/User.js";
import { uploadBase64 } from "../../config/cloudinary.js";

const profileFields = [
  "name",
  "headline",
  "about",
  "skills",
  "experience",
  "education",
  "projects",
];

export async function updateProfile(req, res) {
  try {
    const updates = {};

    for (const field of profileFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (req.body.profileImage) {
      const upload = await uploadBase64(
        req.body.profileImage,
        "profiles"
      );
      updates.profileImage = upload.secure_url;
    }

    if (req.body.bannerImage) {
      const upload = await uploadBase64(
        req.body.bannerImage,
        "banners"
      );
      updates.bannerImage = upload.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    return res.json(user);
  } catch (error) {
    console.error("Update profile failed:", error.message);
    return res.status(400).json({
      message: "Could not update profile",
    });
  }
}
