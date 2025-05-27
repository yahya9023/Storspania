import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { getProducts, deleteProduct } from "../services/products";
import { getReviews } from "../services/reviewService";
import { toast } from "react-toastify";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ratingsMap, setRatingsMap] = useState({});
  const { addToCart } = useContext(CartContext);
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await getProducts();
        setProducts(productsRes.data);

        const categoriesRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);
        setCategories(categoriesRes.data);

        const ratings = {};
        for (const product of productsRes.data) {
          const reviews = await getReviews(product._id);
          if (reviews.length > 0) {
            const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            ratings[product._id] = avg;
          } else {
            ratings[product._id] = 0;
          }
        }
        setRatingsMap(ratings);
      } catch (err) {
        console.error("Error fetching data:", err.message);
      }
    };
    fetchData();
  }, []);

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c._id === categoryId);
    return category ? category.name : "غير معروف";
  };

  const handleAddToCart = (product) => {
    if (product.stock < 1) {
      toast.error("🚫 This product is out of stock");
      return;
    }
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = existingCart.find((item) => item._id === product._id);
    if (exists) {
      toast.error("⚠️ This product is already in cart");
      return;
    }
    const productToCart = {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
    };
    addToCart(productToCart, 1);
    toast.success("✅ Added to cart!");
  };

  const handleDelete = async (id) => {
    if (window.confirm("⚠️ Delete this product?")) {
      try {
        await deleteProduct(id);
        const updatedProducts = await getProducts();
        setProducts(updatedProducts.data);
        toast.success("🗑️ Product deleted");
      } catch (err) {
        toast.error("❌ Failed to delete: " + err.message);
      }
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-dark">🛍️ All Products</h2>
      <div className="row g-4">
        {products.map((p) => (
          <div key={p._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100 shadow-sm">
              <Link to={`/product/${p._id}`}>
                <img
                  src={p.images?.[0] || "https://via.placeholder.com/300x200"}
                  alt={p.name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover", transition: "transform 0.3s" }}
                  onMouseOver={e => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
                />
              </Link>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-truncate">{p.name}</h5>
                <p className="card-text text-truncate" style={{ maxHeight: "3rem" }}>
                  {p.description || "No description available."}
                </p>
                <p className="mb-1"><strong>Category:</strong> {getCategoryName(p.category)}</p>
                <p className="mb-2"><strong>Stock:</strong> {p.stock} unit{p.stock !== 1 && "s"}</p>

                {/* Ratings */}
                <div className="mb-3 text-warning" style={{ fontSize: "1.1rem" }}>
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={
                        i < Math.round(ratingsMap[p._id] || 0)
                          ? "bi bi-star-fill"
                          : "bi bi-star"
                      }
                      aria-hidden="true"
                    ></i>
                  ))}
                  <span className="text-muted ms-2">({(ratingsMap[p._id] || 0).toFixed(1)})</span>
                </div>

                <div className="mt-auto d-flex gap-2">
                  <button
                    onClick={() => handleAddToCart(p)}
                    disabled={p.stock < 1}
                    className={`btn flex-grow-1 ${
                      p.stock < 1 ? "btn-secondary disabled" : "btn-success"
                    }`}
                  >
                    {p.stock < 1 ? "Out of Stock" : "Add to Cart"}
                  </button>

                  <Link
                    to={`/product/${p._id}`}
                    className="btn btn-outline-warning flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                  >
                    <i className="bi bi-info-circle"></i> Details
                  </Link>
                </div>

                {role === "admin" && (
                  <div className="mt-3 d-flex gap-2">
                    <button
                      onClick={() => navigate(`/edit-product/${p._id}`)}
                      className="btn btn-primary flex-grow-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="btn btn-danger flex-grow-1"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
