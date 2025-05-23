import api from "./api";

// ✅ استرجاع التوكين بصيغة Bearer
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ✅ المسارات الصحيحة بلا تكرار "/api"
export const getProducts = () => api.get("/api/products");
export const createProduct = (data) => api.post("/api/products", data, getAuthHeader());
export const updateProduct = (id, data) => api.put(`/api/products/${id}`, data, getAuthHeader());
export const deleteProduct = (id) => api.delete(`/api/products/${id}`, getAuthHeader());
