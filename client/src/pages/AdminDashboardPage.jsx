import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf"; // ✅ مكتبة التصدير

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);

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

  // ✅ الحسابات
  const totalOrders = orders.length;
  const paidOrders = orders.filter((o) => o.isPaid).length;
  const unpaidOrders = orders.filter((o) => !o.isPaid).length;
  const deliveredOrders = orders.filter((o) => o.isDelivered).length;
  const pendingOrders = orders.filter((o) => !o.isDelivered).length;
  const totalRevenue = orders
    .filter((o) => o.isPaid)
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // ✅ توليد PDF
  const exportStatsToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("📊 SpainStore - Admin Dashboard Stats", 14, 20);

    doc.setFontSize(12);
    doc.text(`Total Orders: ${totalOrders}`, 14, 40);
    doc.text(`Paid Orders: ${paidOrders}`, 14, 48);
    doc.text(`Unpaid Orders: ${unpaidOrders}`, 14, 56);
    doc.text(`Delivered Orders: ${deliveredOrders}`, 14, 64);
    doc.text(`Pending Delivery: ${pendingOrders}`, 14, 72);
    doc.text(`Total Revenue: ${totalRevenue.toFixed(2)} MAD`, 14, 80);

    doc.save("dashboard-stats.pdf");
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">📊 Admin Dashboard</h2>

      {/* ✅ زر تصدير PDF */}
      <button
        onClick={exportStatsToPDF}
        className="btn btn-primary mb-4"
      >
        📄 Export Stats
      </button>

      <div className="row g-3">
        <StatCard title="Total Orders" value={totalOrders} />
        <StatCard title="Paid Orders" value={paidOrders} />
        <StatCard title="Unpaid Orders" value={unpaidOrders} />
        <StatCard title="Delivered Orders" value={deliveredOrders} />
        <StatCard title="Pending Delivery" value={pendingOrders} />
        <StatCard title="Total Revenue" value={`${totalRevenue.toFixed(2)} MAD`} />
      </div>
    </div>
  );
}

// ✅ بطاقة إحصائية
function StatCard({ title, value }) {
  return (
    <div className="col-sm-6 col-md-4 col-lg-3">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="display-6 fw-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
