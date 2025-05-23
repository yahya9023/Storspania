import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // ✅ context
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // ✅ استخدام login من context

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const decoded = JSON.parse(atob(res.data.token.split('.')[1]));

      // ✅ خزّن info فـ context
      login(res.data.token, decoded.role);

      toast.success("✅ Logged in successfully");

      // ✅ تحويل حسب الدور
      if (decoded.role === "admin") {
        navigate("/add-product");
      } else {
        navigate("/products");
      }
    } catch (err) {
      toast.error("❌ Login failed: " + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>🔐 Login</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
