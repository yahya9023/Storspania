import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts, updateProduct } from "../services/products";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "", // ✅ إضافة خانة التصنيف
  });

  const [categories, setCategories] = useState([]); // ✅ كل التصنيفات
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
    } catch (err) {
      toast.error("❌ Failed to load categories");
    }
  };

  const fetchProduct = async () => {
    const all = await getProducts();
    const product = all.data.find((p) => p._id === id);
    if (!product) return toast.error("❌ Product not found");

    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category || "", // ✅ قراءة التصنيف
    });

    setExistingImages(product.images || []);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  const handleRemoveExistingImage = (index) => {
    const updated = existingImages.filter((_, i) => i !== index);
    setExistingImages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (const key in form) {
      formData.append(key, form[key]);
    }

    existingImages.forEach((url) => formData.append("existingImages", url));
    newImages.forEach((img) => formData.append("images", img));

    try {
      await updateProduct(id, formData);
      toast.success("✅ Product updated");
      navigate("/products");
    } catch (err) {
      toast.error("❌ Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>✏️ Edit Product</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 400 }}
      >
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
        <input name="price" value={form.price} onChange={handleChange} type="number" placeholder="Price" required />
        <input name="stock" value={form.stock} onChange={handleChange} type="number" placeholder="Stock" required />

        {/* ✅ اختيار التصنيف */}
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <input type="file" multiple accept="image/*" onChange={handleImageChange} />

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {existingImages.map((url, i) => (
            <div key={i} style={{ position: "relative" }}>
              <img
                src={url}
                alt={`existing-${i}`}
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 5,
                }}
              />
              <button
                type="button"
                onClick={() => handleRemoveExistingImage(i)}
                style={{
                  position: "absolute",
                  top: -5,
                  right: -5,
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: 22,
                  height: 22,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                ×
              </button>
            </div>
          ))}

          {previewUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`preview-${i}`}
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: 5,
              }}
            />
          ))}
        </div>

        <button type="submit">💾 Save</button>
      </form>
    </div>
  );
}
