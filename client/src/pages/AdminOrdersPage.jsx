import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      toast.error("❌ Failed to load orders");
    }
  };

  const markAsDelivered = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/orders/${id}/deliver`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("📦 Marked as delivered");
      fetchOrders();
    } catch (err) {
      toast.error("❌ Failed to update delivery status");
    }
  };

  const exportOrderToPDF = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Order Summary", 14, 20);

    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 14, 30);
    doc.text(`User: ${order.user?.email || "N/A"}`, 14, 38);
    doc.text(`Total: ${order.totalAmount} MAD`, 14, 46);
    doc.text(`Payment: ${order.paymentMethod} (${order.isPaid ? "Paid" : "Not Paid"})`, 14, 54);
    doc.text(`Status: ${order.isDelivered ? "Delivered" : "Pending"}`, 14, 62);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 70);

    // إضافة رقم الهاتف هنا
    if (order.paymentMethod === "cod" && order.phoneNumber) {
      doc.text(`Phone: ${order.phoneNumber}`, 14, 78);
    }

    const rows = order.cartItems.map((item) => [
      item.name,
      item.price + " MAD",
      item.quantity,
      item.price * item.quantity + " MAD",
    ]);

    autoTable(doc, {
      startY: 80,
      head: [["Product", "Price", "Qty", "Total"]],
      body: rows,
    });

    doc.save(`order-${order._id}.pdf`);
  };

  const exportAllOrdersToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("All Orders Report", 14, 20);

    const tableData = filteredOrders.map((order) => [
      order._id,
      order.user?.email || "N/A",
      order.totalAmount + " MAD",
      order.paymentMethod.toUpperCase(),
      order.isPaid ? "Paid" : "Unpaid",
      order.isDelivered ? "Delivered" : "Pending",
      new Date(order.createdAt).toLocaleString(),
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["Order ID", "User", "Total", "Payment", "Paid", "Delivered", "Date"]],
      body: tableData,
    });

    doc.save("all-orders.pdf");
  };

  const filteredOrders = orders.filter((order) => {
    let matchStatus = true;
    let matchPayment = true;

    if (statusFilter === "paid") matchStatus = order.isPaid;
    else if (statusFilter === "unpaid") matchStatus = !order.isPaid;
    else if (statusFilter === "delivered") matchStatus = order.isDelivered;
    else if (statusFilter === "pending") matchStatus = !order.isDelivered;

    if (paymentFilter !== "all") {
      matchPayment = order.paymentMethod === paymentFilter;
    }

    return matchStatus && matchPayment;
  });

  return (
    <div className="container py-4">
      <h2 className="mb-4">🧾 Admin — All Orders</h2>

      <div className="d-flex flex-wrap align-items-end gap-3 mb-4">
        <div className="form-group">
          <label htmlFor="statusFilter" className="form-label fw-bold">Status:</label>
          <select
            id="statusFilter"
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="paid">Paid Only</option>
            <option value="unpaid">Unpaid Only</option>
            <option value="delivered">Delivered Only</option>
            <option value="pending">Pending Only</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="paymentFilter" className="form-label fw-bold">Payment Method:</label>
          <select
            id="paymentFilter"
            className="form-select"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="cod">Cash on Delivery</option>
            <option value="online">Online Payment</option>
          </select>
        </div>

        <button
          className="btn btn-primary ms-auto"
          onClick={exportAllOrdersToPDF}
        >
          📄 Export All Orders
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <p>No matching orders.</p>
      ) : (
        filteredOrders.map((order) => (
          <div key={order._id} className="card mb-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Order ID: {order._id}</h5>
              <p className="card-text"><strong>User:</strong> {order.user?.email || "N/A"}</p>
              <p className="card-text"><strong>Total:</strong> {order.totalAmount} MAD</p>
              <p className="card-text">
                <strong>Payment:</strong> {order.paymentMethod.toUpperCase()} {" "}
                {order.isPaid ? <span className="text-success">✅ Paid</span> : <span className="text-danger">❌ Not Paid</span>}
              </p>
              <p className="card-text">
                <strong>Status:</strong> {order.isDelivered ? <span className="text-success">✅ Delivered</span> : <span className="text-warning">⏳ In Progress</span>}
              </p>
              <p className="card-text"><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

              {/* إضافة رقم الهاتف هنا */}
              {order.paymentMethod === "cod" && order.phoneNumber && (
                <p className="card-text">
                  <strong>Phone Number:</strong> {order.phoneNumber}
                </p>
              )}

              <div>
                {!order.isDelivered && (
                  <button
                    className="btn btn-success me-2"
                    onClick={() => markAsDelivered(order._id)}
                  >
                    ✅ Mark as Delivered
                  </button>
                )}
                <button
                  className="btn btn-secondary"
                  onClick={() => exportOrderToPDF(order)}
                >
                  📄 Export PDF
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
