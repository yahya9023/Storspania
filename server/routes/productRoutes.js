import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductById,
} from "../controllers/productController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import upload from "../utils/multer.js"; // ✅ رفع الصور

const router = express.Router();

// ✅ Routes ديال المنتجات
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post(
  "/",
  protect,
  isAdmin,
  upload.array("images", 5), // ✅ دعم رفع حتى 5 صور
  createProduct
);
router.put(
  "/:id",
  protect,
  isAdmin,
  upload.array("images"), // ⬅️ مهم بزاف!
  updateProduct
);
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
