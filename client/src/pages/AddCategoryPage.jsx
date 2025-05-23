import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddCategoryPage() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null); // ✅ لمعرفة واش كنعدل

  useEffect(() => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      if (editingId) {
        await axios.put(`http://localhost:5000/api/categories/${editingId}`, { name }, config);
        toast.success("✅ Category updated");
      } else {
        await axios.post("http://localhost:5000/api/categories", { name }, config);
        toast.success("✅ Category added");
      }

      setName("");
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      toast.error("❌ Error: " + (err.response?.data?.msg || err.message));
    }
  };

  const handleEdit = (category) => {
    setName(category.name);
    setEditingId(category._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.info("🗑️ Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error("❌ Failed to delete: " + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{editingId ? "✏️ Edit Category" : "➕ Add Category"}</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10 }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          required
        />
        <button type="submit">{editingId ? "💾 Update" : "Add"}</button>
      </form>

      <hr style={{ margin: "30px 0" }} />

      <h3>📁 Existing Categories</h3>
      {categories.length === 0 ? (
        <p>No categories available.</p>
      ) : (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {categories.map((c) => (
            <li
              key={c._id}
              style={{
                marginBottom: 10,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #ccc",
                padding: "8px 12px",
                borderRadius: 6,
              }}
            >
              <span>{c.name}</span>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => handleEdit(c)}>✏️ Edit</button>
                <button onClick={() => handleDelete(c._id)} style={{ backgroundColor: "red", color: "white" }}>
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
