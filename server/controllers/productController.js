import Product from "../models/Product.js";
import Review from "../models/Review.js"; // ⬅️ نحتاج استيراد reviews

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
      category,
      images: imageUrls,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create product", error: err.message });
  }
};

// ✅ جلب جميع المنتجات مع تقييم متوسط
export const getProducts = async (req, res) => {
  try {
    const category = req.query.category;
    const filter = category ? { category } : {};
    const products = await Product.find(filter).populate("category").lean();

    for (let product of products) {
      const reviews = await Review.find({ product: product._id });
      const avgRating =
        reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / (reviews.length || 1);
      product.rating = Math.round(avgRating * 10) / 10;
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch products", error: err.message });
  }
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
        category,
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

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
