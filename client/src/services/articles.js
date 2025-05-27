import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // عدل لو تستخدم طريقة تخزين أخرى
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      // خلي Content-Type فارغ عشان axios يحددها تلقائياً مع FormData
    },
  };
};

export const getArticles = () => {
  return axios.get(`${API}/api/articles`, getAuthHeaders());
};

export const getArticleById = (id) => {
  return axios.get(`${API}/api/articles/${id}`, getAuthHeaders());
};

export const createArticle = (data) =>
  axios.post(`${API}/api/articles`, data, {
    ...getAuthHeaders(),
    headers: {
      ...getAuthHeaders().headers,
      "Content-Type": "multipart/form-data", // مهم للرفع
    },
  });

export const updateArticle = (id, data) =>
  axios.put(`${API}/api/articles/${id}`, data, {
    ...getAuthHeaders(),
    headers: {
      ...getAuthHeaders().headers,
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteArticle = (id) => {
  return axios.delete(`${API}/api/articles/${id}`, getAuthHeaders());
};
