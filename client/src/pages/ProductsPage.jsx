import { useEffect, useState } from "react";
import axios from "axios";

const handleAddToCart = (product) => {
  const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

  const isAlreadyInCart = existingCart.find((item) => item._id === product._id);

  if (isAlreadyInCart) {
    alert("📦 Already in cart");
    return;
  }

  const updatedCart = [...existingCart, { ...product, quantity: 1 }];
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  alert("✅ Added to cart!");
};


export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🛍️ All Products</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {products.map((product) => (
          <div
            key={product._id}
            style={{
              width: 250,
              padding: 10,
              border: "1px solid #ccc",
              borderRadius: 8,
              backgroundColor: "#fff",
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 6 }}
            />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <b>{product.price} MAD</b>
            <button
  onClick={() => handleAddToCart(product)}
  style={{
    marginTop: 10,
    padding: "8px 12px",
    border: "none",
    borderRadius: 5,
    backgroundColor: "#00C776",
    color: "white",
    cursor: "pointer"
  }}
>
  Add to Cart
</button>

            
          </div>
          
        ))}
      </div>
    </div>
  );
}
