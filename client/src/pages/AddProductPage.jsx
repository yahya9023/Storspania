import { useState } from "react";
import axios from "axios";

export default function AddProductPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // 1. Upload Image
      const imgData = new FormData();
      imgData.append("image", form.image);

      const uploadRes = await axios.post(
        "http://localhost:5000/api/products/upload",
        imgData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const imageUrl = uploadRes.data.imageUrl;

      // 2. Save Product
      const productData = {
        ...form,
        image: imageUrl,
      };

      await axios.post("http://localhost:5000/api/products", productData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Product created!");
      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image: null,
      });
      setPreview(null);
    } catch (err) {
      alert("❌ Error creating product: " + err.message);
    }

    setUploading(false);
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h2>Add New Product</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <input type="text" name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} />
        <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} />

        <input type="file" name="image" accept="image/*" onChange={handleChange} />
        {preview && <img src={preview} alt="preview" width={200} style={{ borderRadius: 8 }} />}

        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
