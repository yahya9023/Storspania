import Product from "../models/Product.js";

// ✅ إنشاء منتج جديد مع الصور
export const createProduct = async (req, res) => {
  try {
    const imageUrls = req.files?.map((file) => file.path) || [];
    const { name, description, price, stock, category } = req.body;

    if (!category || category.trim() === "") {
      return res.status(400).json({ msg: "Category is required" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category, // ✅ تم إصلاحها هنا
      images: imageUrls,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create product", error: err.message });
  }
};

// ✅ جلب جميع المنتجات
export const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

// ✅ تحديث منتج مع الصور القديمة والجديدة
export const updateProduct = async (req, res) => {
  try {
    const imageUrls = req.files?.map((file) => file.path) || [];
    const { name, description, price, stock, category } = req.body;

    if (!category || category.trim() === "") {
      return res.status(400).json({ msg: "Category is required" });
    }

    let existingImages = req.body.existingImages || [];
    if (typeof existingImages === "string") {
      existingImages = [existingImages];
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        stock,
        category, // ✅ تم إصلاحها هنا
        images: [...existingImages, ...imageUrls],
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("❌ Update failed:", err);
    res.status(500).json({ msg: "Update failed", error: err.message });
  }
};

// ✅ حذف منتج
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Product deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed", error: err.message });
  }
};
