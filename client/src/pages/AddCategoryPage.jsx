import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddCategoryPage() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

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
    <div className="container py-4">
      <h2 className="mb-4">{editingId ? "✏️ Edit Category" : "➕ Add Category"}</h2>

      <form onSubmit={handleSubmit} className="d-flex gap-2 mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          required
          className="form-control"
        />
        <button type="submit" className={`btn ${editingId ? "btn-success" : "btn-primary"}`}>
          {editingId ? "💾 Update" : "Add"}
        </button>
      </form>

      <hr />

      <h3 className="mb-3">📁 Existing Categories</h3>
      {categories.length === 0 ? (
        <p>No categories available.</p>
      ) : (
        <ul className="list-group">
          {categories.map((c) => (
            <li
              key={c._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span className="fw-bold">{c.name}</span>
              <div className="btn-group btn-group-sm" role="group" aria-label="Category actions">
                <button onClick={() => handleEdit(c)} className="btn btn-outline-primary">
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="btn btn-outline-danger"
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
