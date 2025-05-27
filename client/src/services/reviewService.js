import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

export const getReviews = async (productId) => {
  const res = await axios.get(`${API}/api/reviews/${productId}`);
  return res.data;
};

export const createReview = async (productId, reviewData, token) => {
  const res = await axios.post(
    `${API}/api/reviews/${productId}`,
    reviewData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const updateReview = async (productId, reviewData, token) => {
  const res = await axios.put(
    `${API}/api/reviews/${productId}`, // ✅ هذا الصحيح
    reviewData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
