import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { token, role, logout } = useContext(AuthContext);
  const { totalCount } = useContext(CartContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#f0f0f0",
        marginBottom: 20,
      }}
    >
      <Link to="/">🏠 Home</Link>

      <div style={{ display: "flex", gap: 20 }}>
        <Link to="/products">🛍️ Products</Link>
        <Link to="/cart">🛒 Cart ({totalCount})</Link>

        {/* ✅ فقط للمشرف */}
        {role === "admin" && (
          <>
            <Link to="/add-product">➕ Add Product</Link>
            <Link to="/add-category">📂 Add Category</Link> {/* ✅ الزر الجديد */}
          </>
        )}

        {token ? (
          <>
            <span>👋 {role === "admin" ? "Admin" : "Customer"}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">🔐 Login</Link>
            <Link to="/register">📝 Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
