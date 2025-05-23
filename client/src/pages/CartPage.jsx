import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

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
                <p>
                  Quantity:
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                  <b style={{ margin: "0 10px" }}>{item.quantity}</b>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
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
