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
    <nav className="navbar navbar-expand-lg navbar-light bg-warning sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-dark" to="/">
          🏠 SpainStore
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link fw-semibold text-dark" to="/products">
                🛍️ Products
              </Link>
            </li>

            <li className="nav-item position-relative">
              <Link className="nav-link fw-semibold text-dark" to="/cart">
                🛒 Cart
                {totalCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {totalCount}
                    <span className="visually-hidden">items in cart</span>
                  </span>
                )}
              </Link>
            </li>

            {role === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-dark" to="/add-product">
                    ➕ Add Product
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-dark" to="/add-category">
                    📂 Add Category
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-dark" to="/admin/orders">
                    📋 Orders
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-dark" to="/admin/dashboard">
                    📊 Dashboard
                  </Link>
                </li>
                {/* إضافة زر المقالات هنا */}
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-dark" to="/admin/articles">
                    📝 Add Articles
                  </Link>
                </li>
              </>
            )}

            {token && role !== "admin" && (
              <li className="nav-item">
                <Link className="nav-link fw-semibold text-dark" to="/orders">
                  📦 My Orders
                </Link>
              </li>
            )}

            {token ? (
              <li className="nav-item d-flex align-items-center">
                <span className="me-3 fw-semibold text-dark">
                  👋 {role === "admin" ? "Admin" : "Customer"}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-dark btn-sm"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-dark" to="/login">
                    🔐 Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-dark" to="/register">
                    📝 Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
