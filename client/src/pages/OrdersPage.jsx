import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/orders/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (err) {
      toast.error("❌ Failed to load orders");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">📦 My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-muted">You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">🆔 Order ID: {order._id}</h5>
              <p className="card-text"><strong>Total:</strong> {order.totalAmount} MAD</p>
              <p className="card-text">
                <strong>Payment:</strong> {order.paymentMethod.toUpperCase()}{" "}
                {order.isPaid ? (
                  <span className="text-success">✅ Paid</span>
                ) : (
                  <span className="text-danger">❌ Not Paid</span>
                )}
              </p>
              <p className="card-text">
                <strong>Status:</strong>{" "}
                {order.isDelivered ? (
                  <span className="text-primary">📦 Delivered</span>
                ) : (
                  <span className="text-warning">⏳ In Progress</span>
                )}
              </p>
              <p className="card-text"><strong>Ordered at:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              {/* Display Phone Number if payment is COD */}
              {order.paymentMethod === "cod" && order.phoneNumber && (
                <p className="card-text">
                  <strong>Phone Number:</strong> {order.phoneNumber}
                </p>
              )}

              <div className="mt-3">
                <strong>Items:</strong>
                <ul className="list-group list-group-flush">
                  {order.cartItems.map((item, idx) => (
                    <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{item.name}</span>
                      <span>
                        {item.price} MAD × {item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
