import dotenv from "dotenv";
import cloud from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const cloudinary = cloud.v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
});

export default cloudinary;

export const upload = multer({ storage });
