import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    updateCartCount();
    checkLogin();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalQty);
  };

  const checkLogin = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    alert("👋 Logged out");
    setIsLoggedIn(false);
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
        <Link to="/cart">🛒 Cart ({cartCount})</Link>

        {isLoggedIn ? (
          <>
            <span>👋 Welcome</span>
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
