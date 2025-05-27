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
      category: product.category?._id || product.category || "",
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

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c._id === id);
    return cat ? cat.name : "N/A";
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">{editingId ? "✏️ Edit Product" : "➕ Add Product"}</h2>
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3" style={{ maxWidth: 500 }}>
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          className="form-control"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="form-control"
          rows={3}
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="form-control"
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
          className="form-control"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="form-select"
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="form-control"
        />

        <div className="d-flex flex-wrap gap-2 mt-2">
          {existingImages.map((url, i) => (
            <div key={i} className="position-relative" style={{ width: 100, height: 100 }}>
              <img
                src={url}
                alt={`existing-${i}`}
                className="img-thumbnail rounded"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
              <button
                type="button"
                onClick={() => handleRemoveExistingImage(url)}
                className="btn btn-sm btn-danger position-absolute top-0 end-0"
                style={{ borderRadius: "0 0.25rem 0 0.25rem" }}
              >
                ✖
              </button>
            </div>
          ))}
          {previewUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`preview-${i}`}
              className="img-thumbnail rounded"
              style={{ width: 100, height: 100, objectFit: "cover" }}
            />
          ))}
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          {editingId ? "💾 Update" : "➕ Add"}
        </button>
      </form>

      <hr className="my-5" />

      <h3>📦 Product List</h3>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <ul className="list-unstyled">
          {products.map((p) => (
            <li
              key={p._id}
              className="mb-3 border rounded p-3 shadow-sm"
            >
              <div>
                <b>{p.name}</b> — {p.price} MAD — Stock: {p.stock}
              </div>
              <div>{p.description}</div>
              <div><b>Category:</b> {getCategoryName(p.category)}</div>

              {Array.isArray(p.images) && p.images.length > 0 && (
                <div className="d-flex gap-2 mt-2 flex-wrap">
                  {p.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={p.name}
                      className="img-thumbnail rounded"
                      style={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                  ))}
                </div>
              )}

              <div className="mt-3">
                <button
                  onClick={() => handleEdit(p)}
                  className="btn btn-sm btn-warning me-2"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="btn btn-sm btn-danger"
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
