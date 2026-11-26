import { v2 as cloudinary } from "cloudinary";

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export async function uploadBase64(image, folder) {
  if (!image) {
    throw new Error("An image is required");
  }

  return cloudinary.uploader.upload(image, {
    folder: `proconnect/${folder}`,
    resource_type: "image",
  });
}

export { cloudinary };
