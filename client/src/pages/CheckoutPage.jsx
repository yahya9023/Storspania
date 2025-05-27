import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CheckoutPage() {
  const { cart, clearCart } = useContext(CartContext);
  const [paymentMethod] = useState("cod"); // فقط الدفع نقدًا عند التسليم
  const [phoneNumber, setPhoneNumber] = useState(""); // لتخزين رقم الهاتف
  const [phoneError, setPhoneError] = useState(""); // لتخزين الأخطاء الخاصة بالهاتف
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!cart || !Array.isArray(cart)) {
    return <p>Loading cart...</p>;
  }

  const handleOrder = async () => {
    if (cart.length === 0) {
      toast.error("🚫 Cart is empty");
      return;
    }

    if (!phoneNumber) {
      toast.error("🚫 Please enter your phone number.");
      return;
    }

    // التأكد من أن رقم الهاتف يحتوي فقط على أرقام
    if (!/^\d+$/.test(phoneNumber)) {
      setPhoneError("❌ Phone number must contain only numbers.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      // بيانات الطلب مع رقم الهاتف
      const orderData = {
        cartItems: cart,
        totalAmount: totalPrice,
        paymentMethod,
        phoneNumber, // إضافة رقم الهاتف
      };

      await axios.post(
        "http://localhost:5000/api/orders", 
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("✅ Order placed successfully!");
      clearCart();
      navigate("/"); // العودة إلى الصفحة الرئيسية أو صفحة أخرى بعد تأكيد الطلب
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to place order");
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: 600 }}>
      <h2 className="mb-4">✅ Confirm Your Order</h2>

      <div className="list-group mb-3">
        {cart.map((item) => (
          <div
            key={item._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{item.name}</strong>
              <span className="text-muted ms-2">
                — {item.price} MAD x {item.quantity}
              </span>
            </div>
            <div className="fw-bold">{(item.price * item.quantity).toFixed(2)} MAD</div>
          </div>
        ))}
      </div>

      <h4 className="text-end mb-4">
        Total: <span className="text-success">{totalPrice.toFixed(2)} MAD</span>
      </h4>

      <div className="mb-4">
        <label htmlFor="paymentMethod" className="form-label">
          <strong>Payment Method:</strong>
        </label>
        <select
          id="paymentMethod"
          className="form-select"
          value={paymentMethod}
          disabled
        >
          <option value="cod">💵 Cash on Delivery</option>
        </select>
      </div>

      {/* إظهار حقل رقم الهاتف عند اختيار الدفع نقدًا عند التسليم */}
      {paymentMethod === "cod" && (
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="form-label">
            <strong>Phone Number:</strong>
          </label>
          <input
            type="text"
            id="phoneNumber"
            className="form-control"
            value={phoneNumber}
            onChange={(e) => {
              // تحديث الرقم ومنع إدخال الحروف
              const value = e.target.value.replace(/[^0-9]/g, '');  // استبدال الحروف بأي شيء آخر غير الأرقام
              setPhoneNumber(value);
              setPhoneError(""); // مسح الأخطاء عند التغيير
            }}
            placeholder="Enter your phone number"
            required
          />
          {phoneError && <p className="text-danger">{phoneError}</p>} {/* عرض رسالة الخطأ */}
        </div>
      )}

      <button
        onClick={handleOrder}
        className="btn btn-success w-100"
        type="button"
      >
        Confirm Order
      </button>
    </div>
  );
}
