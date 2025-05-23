import { useEffect, useState } from "react";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../services/products";
import { getCategories } from "../services/categories";
import { toast } from "react-toastify";

export default function AddProductPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const res = await getProducts();
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      toast.error("❌ Failed to load categories");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
  };

  const handleRemoveExistingImage = (url) => {
    setExistingImages(existingImages.filter((img) => img !== url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      existingImages.forEach((img) => formData.append("existingImages", img));
      images.forEach((img) => formData.append("images", img));

      if (editingId) {
        await updateProduct(editingId, formData);
        toast.success("✅ Product updated");
      } else {
        await createProduct(formData);
        toast.success("✅ Product added");
      }

      // Reset
      setForm({ name: "", description: "", price: "", stock: "", category: "" });
      setImages([]);
      setPreviewUrls([]);
      setExistingImages([]);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      toast.error("❌ Error: " + err.message);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category || "",
    });
    setEditingId(product._id);
    setExistingImages(product.images || []);
  };

  const handleDelete = async (id) => {
    if (window.confirm("⚠️ Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      fetchProducts();
      toast.info("🗑️ Product deleted");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{editingId ? "✏️ Edit Product" : "➕ Add Product"}</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 400 }}>
        <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />

        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <input type="file" name="images" multiple accept="image/*" onChange={handleImageChange} />

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {existingImages.map((url, i) => (
            <div key={i} style={{ position: "relative" }}>
              <img src={url} alt={`existing-${i}`} style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 5 }} />
              <button
                type="button"
                onClick={() => handleRemoveExistingImage(url)}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "0 5px 0 5px",
                  cursor: "pointer",
                  padding: "2px 6px",
                }}
              >
                ✖
              </button>
            </div>
          ))}
          {previewUrls.map((url, i) => (
            <img key={i} src={url} alt={`preview-${i}`} style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 5 }} />
          ))}
        </div>

        <button type="submit">{editingId ? "💾 Update" : "➕ Add"}</button>
      </form>

      <hr style={{ margin: "30px 0" }} />

      <h3>📦 Product List</h3>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {products.map((p) => (
            <li key={p._id} style={{ marginBottom: 15, border: "1px solid #ccc", borderRadius: 8, padding: 10 }}>
              <div>
                <b>{p.name}</b> — {p.price} MAD — Stock: {p.stock}
              </div>
              <div>{p.description}</div>
              <div><b>Category:</b> {p.category || "N/A"}</div>

              {Array.isArray(p.images) && p.images.length > 0 && (
                <div style={{ display: "flex", gap: 10, marginTop: 5 }}>
                  {p.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={p.name}
                      style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 5 }}
                    />
                  ))}
                </div>
              )}

              <div style={{ marginTop: 10 }}>
                <button onClick={() => handleEdit(p)} style={{ marginRight: 10 }}>✏️ Edit</button>
                <button onClick={() => handleDelete(p._id)} style={{ backgroundColor: "red", color: "white" }}>🗑️ Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
