import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddProductPage from "./pages/AddProductPage"; 
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Welcome to Spain Store</h1>} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
