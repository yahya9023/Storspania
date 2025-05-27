// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function CategoryPage() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      .get(`${API}/api/products?category=${categoryId}`)
      .then((res) => setProducts(res.data));
  }, [categoryId, API]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📦 المنتجات حسب القسم</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <Link key={p._id} to={`/product/${p._id}`} className="bg-white p-4 rounded shadow">
            <img
  src={p.images?.[0] || "https://via.placeholder.com/300x200"}
  alt={p.name}
  className="w-full h-40 object-cover mb-3 rounded"
/>

            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-yellow-700 font-bold">{p.price} €</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryPage;
