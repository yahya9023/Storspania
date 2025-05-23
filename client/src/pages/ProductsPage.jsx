import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/products");
    setProducts(res.data);
  };

  const handleAddToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const isInCart = existingCart.find((item) => item._id === product._id);

    if (isInCart) {
      alert("📦 Already in cart");
      return;
    }

    const updatedCart = [...existingCart, { ...product, quantity: 1 }];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert("✅ Added to cart!");
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
              src={p.image}
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
            <p><b>Stock:</b> {p.stock} unit(s)</p> {/* ✅ عرض الكمية المتوفرة */}
            <b>{p.price} MAD</b>

            <div style={{ marginTop: 10 }}>
              <button onClick={() => handleAddToCart(p)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
