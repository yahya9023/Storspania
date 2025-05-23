import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddProductPage from "./pages/AddProductPage";
import EditProductPage from "./pages/EditProductPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CartPage from "./pages/CartPage";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import AddCategoryPage from "./pages/AddCategoryPage"; // ✅ صفحة إضافة صنف

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<h1>Welcome to Spain Store</h1>} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* ✅ صفحات محمية للمشرف فقط */}
              <Route
                path="/add-product"
                element={
                  <ProtectedRoute>
                    <AddProductPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-product/:id"
                element={
                  <ProtectedRoute>
                    <EditProductPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-category"
                element={
                  <ProtectedRoute>
                    <AddCategoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>

          <ToastContainer position="top-right" autoClose={3000} />
        </>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
