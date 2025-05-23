import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddProductPage from "./pages/AddProductPage"; 
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage"; // ✅ لازم تزيدها
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ تأكد عندك الملف

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Welcome to Spain Store</h1>} />

        {/* ✅ صفحة عامة */}
        <Route path="/products" element={<ProductsPage />} />

        {/* ✅ صفحات الدخول */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ✅ صفحة محمية: admin فقط */}
        <Route
          path="/add-product"
          element={
            <ProtectedRoute>
              <AddProductPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
