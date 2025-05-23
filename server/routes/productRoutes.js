import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import upload from "../utils/multer.js"; // ✅ رفع الصور

const router = express.Router();

// ✅ Routes ديال المنتجات
router.get("/", getProducts);
router.post("/", protect, isAdmin, createProduct);
router.put("/:id", protect, isAdmin, updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);

// ✅ Route خاص برفع الصور
router.post(
  "/upload",
  protect,
  isAdmin,
  upload.single("image"),
  (req, res) => {
    res.json({ imageUrl: req.file.path });
  }
);

export default router;
