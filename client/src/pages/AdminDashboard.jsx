import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      toast.success("❌ Failed to fetch products");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      toast.error("❌ Failed to delete");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🛠️ Admin Dashboard</h2>

      <button
        onClick={() => navigate("/add-product")}
        style={{
          marginBottom: 20,
          padding: "10px 15px",
          backgroundColor: "#00C776",
          color: "white",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
        }}
      >
        ➕ Add Product
      </button>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#eee" }}>
            <th style={td}>Image</th>
            <th style={td}>Name</th>
            <th style={td}>Price</th>
            <th style={td}>Stock</th>
            <th style={td}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td style={td}>
                <img src={p.image} alt={p.name} width={50} height={50} />
              </td>
              <td style={td}>{p.name}</td>
              <td style={td}>{p.price} MAD</td>
              <td style={td}>{p.stock}</td>
              <td style={td}>
                <button
                  onClick={() => navigate(`/products/edit/${p._id}`)}
                  style={{ marginRight: 10 }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deleteProduct(p._id)}
                  style={{ color: "red" }}
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const td = {
  padding: 10,
  border: "1px solid #ccc",
  textAlign: "center",
};
