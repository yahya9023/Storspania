import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddProductPage from "./pages/AddProductPage"; 
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage"; 
import ProtectedRoute from "./components/ProtectedRoute"; 
import CartPage from "./pages/CartPage";
import Navbar from "./components/Navbar";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1>Welcome to Spain Store</h1>} />

        {/* ✅ صفحة عامة */}
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />

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
