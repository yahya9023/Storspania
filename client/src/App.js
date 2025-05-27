import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddProductPage from "./pages/AddProductPage";
import EditProductPage from "./pages/EditProductPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage"; // ✅ جديد
import ProtectedRoute from "./components/ProtectedRoute";
import CartPage from "./pages/CartPage";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import AddCategoryPage from "./pages/AddCategoryPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CategoryPage from "./pages/CategoryPage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailsPage from "./pages/ArticleDetailsPage";
import AdminArticlesPage from "./pages/AdminArticlesPage"; // صفحة إدارة المقالات


import Footer from "./components/Footer";  // ✅ استدعاء الفوتر

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
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} /> {/* ✅ جديد */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/articles/:id" element={<ArticleDetailsPage />} />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

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
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute>
                    <AdminOrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              {/* صفحة إدارة المقالات محمية */}
              <Route
                path="/admin/articles"
                element={
                  <ProtectedRoute>
                    <AdminArticlesPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>

          <Footer /> {/* ✅ عرض الفوتر أسفل الموقع */}

          <ToastContainer position="top-right" autoClose={3000} />
        </>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
