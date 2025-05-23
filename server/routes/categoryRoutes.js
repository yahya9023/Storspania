import express from "express";
import Category from "../models/Category.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all
router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// Create (admin only)
router.post("/", protect, isAdmin, async (req, res) => {
  const category = await Category.create({ name: req.body.name });
  res.status(201).json(category);
});

// Update category by ID (admin only)
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    if (!category) return res.status(404).json({ msg: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ msg: "Update failed", error: err.message });
  }
});

// Delete category by ID (admin only)
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ msg: "Category not found" });
    res.json({ msg: "Category deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed", error: err.message });
  }
});


export default router;
