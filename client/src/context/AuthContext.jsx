import { createContext, useEffect, useState, useContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

  const login = (newToken, newRole, newUserId) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    localStorage.setItem("userId", newUserId);
    setToken(newToken);
    setRole(newRole);
    setUserId(newUserId);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    setToken(null);
    setRole(null);
    setUserId(null);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUserId = localStorage.getItem("userId");

    if (storedToken) setToken(storedToken);
    if (storedRole) setRole(storedRole);
    if (storedUserId) setUserId(storedUserId);
  }, []);

  const user = token
    ? { token, isAdmin: role === "admin", id: userId }
    : null;

  return (
    <AuthContext.Provider value={{ token, role, userId, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
