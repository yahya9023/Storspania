import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container py-4">
      <h2 className="mb-4">🛒 Shopping Cart</h2>

      {cart.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item._id}
              className="d-flex align-items-center justify-content-between border rounded p-3 mb-3 bg-light"
            >
              {/* صورة المنتج */}
              <img
                src={item.image}
                alt={item.name}
                className="rounded"
                style={{ width: 80, height: 80, objectFit: "cover", marginRight: 20 }}
              />

              {/* معلومات المنتج */}
              <div className="flex-grow-1">
                <h5>{item.name}</h5>
                <p className="mb-1">Price: {item.price} MAD</p>
                <div className="d-flex align-items-center">
                  <span>Quantity:</span>
                  <button
                    className="btn btn-outline-secondary btn-sm ms-2"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <strong className="mx-2">{item.quantity}</strong>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* زر الحذف */}
              <button
                className="btn btn-danger"
                onClick={() => removeFromCart(item._id)}
              >
                Remove
              </button>
            </div>
          ))}

          {/* المجموع */}
          <h4>Total: {total.toFixed(2)} MAD</h4>

          {/* زر المتابعة للطلب */}
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/checkout")}
          >
            ✅ Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}
