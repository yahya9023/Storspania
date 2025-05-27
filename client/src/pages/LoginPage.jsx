import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; 
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const decoded = JSON.parse(atob(res.data.token.split('.')[1]));

      login(res.data.token, decoded.role, res.data.user.id);

      toast.success("✅ Logged in successfully");

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
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4 text-center">🔐 Login</h2>
      <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
        <input
          type="email"
          placeholder="Email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
}
