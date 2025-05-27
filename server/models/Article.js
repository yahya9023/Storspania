import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  images: [{ type: String }],  // array of image URLs من Cloudinary
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Article", articleSchema);
