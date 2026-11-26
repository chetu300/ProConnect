import Post from "../../models/Post.js";
import { uploadBase64 } from "../../config/cloudinary.js";

export async function createPost(req, res) {
  const body = req.body || {};
  const text = typeof body.text === "string" ? body.text.trim() : "";
  const image = typeof body.image === "string" ? body.image : "";

  if (!text && !image) {
    return res.status(400).json({
      message: "Add some text or an image to your post",
    });
  }

  let imageUrl = "";
  if (image) {
    try {
      const upload = await uploadBase64(image, "posts");
      imageUrl = upload.secure_url;
    } catch (error) {
      const uploadStatus = Number(error.http_code || error.statusCode) || null;
      console.error("Create post image upload failed:", {
        status: uploadStatus,
        message: error.message,
      });
      const message =
        uploadStatus === 401 || uploadStatus === 403
          ? "Photo storage rejected its credentials. Check the Cloudinary settings."
          : uploadStatus === 400
            ? "Photo storage rejected this file. Try a JPG or PNG image."
            : "Photo storage is unavailable. Try again later or remove the photo.";
      return res.status(502).json({
        message,
      });
    }
  }

  let post;
  try {
    post = await Post.create({
      author: req.user._id,
      text,
      image: imageUrl,
    });
  } catch (error) {
    console.error("Save post failed:", error.message);
    return res.status(500).json({
      message: "Could not save this post. Please try again.",
    });
  }

  const result = post.toObject();
  result.author = {
    _id: req.user._id,
    name: req.user.name,
    username: req.user.username,
    profileImage: req.user.profileImage,
    headline: req.user.headline,
  };
  return res.status(201).json(result);
}
