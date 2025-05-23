import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const removeFromCart = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const updateQuantity = (id, type) => {
    const updated = cart.map((item) => {
      if (item._id === id) {
        let newQty =
          type === "inc"
            ? item.quantity + 1
            : item.quantity - 1;

        // ⛔ ما يفوتش الكمية المتوفرة
        if (type === "inc" && newQty > item.stock) {
          alert(`🚫 Only ${item.stock} units available`);
          newQty = item.stock;
        }

        // ✅ إذا نقص حتى 0 → نحيدوه
        if (type === "dec" && newQty < 1) {
          return null;
        }

        return { ...item, quantity: newQty };
      }
      return item;
    });

    const filtered = updated.filter(Boolean); // نحيد nulls
    setCart(filtered);
    localStorage.setItem("cart", JSON.stringify(filtered));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ padding: 20 }}>
      <h2>🛒 Shopping Cart</h2>

      {cart.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid #ddd",
                borderRadius: 6,
                padding: 10,
                marginBottom: 10,
              }}
            >
              <div>
                <h4>{item.name}</h4>
                <p>Price: {item.price} MAD</p>
                <p>Stock Available: {item.stock}</p>
                <p>
                  Quantity:
                  <button
                    onClick={() => updateQuantity(item._id, "dec")}
                    style={{ margin: "0 5px" }}
                  >
                    -
                  </button>
                  <strong>{item.quantity}</strong>
                  <button
                    onClick={() => updateQuantity(item._id, "inc")}
                    style={{ margin: "0 5px" }}
                  >
                    +
                  </button>
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                style={{
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: 5,
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <h3>Total: {total.toFixed(2)} MAD</h3>
        </div>
      )}
    </div>
  );
}
