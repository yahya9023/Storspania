import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { getProducts, deleteProduct } from "../services/products";
import { toast } from "react-toastify";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err.message);
    }
  };

  const handleAddToCart = (product) => {
    if (product.stock < 1) {
      toast.error("🚫 This product is out of stock");
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = existingCart.find((item) => item._id === product._id);

    if (exists) {
      toast.error("⚠️ This product is already in cart");
      return;
    }

    addToCart(product, 1);
    toast.success("✅ Added to cart!");
  };

  const handleDelete = async (id) => {
    if (window.confirm("⚠️ Delete this product?")) {
      try {
        await deleteProduct(id);
        fetchProducts();
        toast.success("🗑️ Product deleted");
      } catch (err) {
        toast.error("❌ Failed to delete: " + err.message);
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🛍️ All Products</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {products.map((p) => (
          <div
            key={p._id}
            style={{
              width: 250,
              padding: 10,
              border: "1px solid #ccc",
              borderRadius: 8,
              backgroundColor: "#fff",
            }}
          >
            <img
              src={p.images?.[0]}
              alt={p.name}
              style={{
                width: "100%",
                height: 150,
                objectFit: "cover",
                borderRadius: 6,
              }}
            />

            <h3>{p.name}</h3>
            <p>{p.description}</p>

            {/* ✅ عرض التصنيف */}
            <p><b>Category:</b> {p.category || "Uncategorized"}</p>

            <p><b>Stock:</b> {p.stock} unit(s)</p>
            <b>{p.price} MAD</b>

            <div style={{ marginTop: 10 }}>
              <button
                onClick={() => handleAddToCart(p)}
                disabled={p.stock < 1}
                style={{
                  opacity: p.stock < 1 ? 0.5 : 1,
                  cursor: p.stock < 1 ? "not-allowed" : "pointer",
                }}
              >
                {p.stock < 1 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>

            {role === "admin" && (
              <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                <button
                  onClick={() => navigate(`/edit-product/${p._id}`)}
                  style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: 5,
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: 5,
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
