import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ProductReviews from "../components/ProductReviews";
import { getReviews } from "../services/reviewService";
import { useCart } from "../context/CartContext";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) setVisible(true);
      else setVisible(false);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="btn btn-warning position-fixed"
      style={{ bottom: "2rem", right: "2rem", borderRadius: "50%", width: "3rem", height: "3rem", fontSize: "1.5rem" }}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
};

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [mainImage, setMainImage] = useState("");
  const { cart, addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/${id}`);
        setProduct(res.data);
        setMainImage(res.data.images?.[0] || "");
      } catch (error) {
        toast.error("❌ خطأ في جلب معلومات المنتوج");
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);
        setCategories(res.data);
      } catch (error) {
        toast.error("❌ خطأ في جلب الأقسام");
      }
    };

    const fetchAverageRating = async () => {
      try {
        const reviews = await getReviews(id);
        if (reviews.length > 0) {
          const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
          setAverageRating(avg);
        } else {
          setAverageRating(0);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
    fetchCategories();
    fetchAverageRating();
  }, [id]);

  const getCategoryName = (catId) => {
    const cat = categories.find((c) => c._id === catId);
    return cat ? cat.name : "غير معروف";
  };

  const handleAddToCart = () => {
    if (!product) return;

    const exists = cart.find((item) => item._id === product._id);
    if (exists) {
      toast.info("🔄 هذا المنتج موجود مسبقاً في السلة");
    } else {
      addToCart(product);
      toast.success("✅ تم إضافة المنتج إلى السلة");
    }
  };

  if (!product)
    return (
      <p className="text-center p-5 text-secondary">جاري تحميل المنتوج...</p>
    );

  return (
    <>
      <div className="container my-5 p-4 bg-white rounded shadow">
        {/* Title & Rating */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <h1 className="text-warning fw-bold">{product.name}</h1>
          {averageRating > 0 && (
            <div className="d-flex align-items-center text-warning fs-4 user-select-none">
              {"★".repeat(Math.round(averageRating))}
              {"☆".repeat(5 - Math.round(averageRating))}
              <span className="text-secondary fs-6 ms-2">
                ({averageRating.toFixed(1)} / 5)
              </span>
            </div>
          )}
        </div>

        {/* Images Section */}
        <div className="row g-4">
          {/* Main Image */}
          <div className="col-md-6">
            <img
              src={mainImage}
              alt={product.name}
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: "450px", objectFit: "cover", width: "100%" }}
            />
          </div>

          {/* Thumbnails */}
          <div className="col-md-1 d-flex flex-md-column overflow-auto" style={{ maxHeight: "450px" }}>
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                onClick={() => setMainImage(img)}
                className={`mb-2 rounded shadow-sm border ${
                  img === mainImage ? "border-warning scale-110" : "border-transparent"
                }`}
                style={{
                  cursor: "pointer",
                  width: "75px",
                  height: "75px",
                  objectFit: "cover",
                  transition: "transform 0.3s",
                  transform: img === mainImage ? "scale(1.1)" : "none",
                }}
                loading="lazy"
              />
            ))}
          </div>

          {/* Product Info */}
          <div className="col-md-5 text-secondary">
            <p className="fs-4 fw-semibold text-warning">💰 الثمن: {product.price} درهم</p>
            <p className="fs-5">
              📦 المتوفر: <span className="fw-medium">{product.stock} وحدة</span>
            </p>
            <p className="fs-5">
              🏷️ الصنف: <span className="fw-semibold">{getCategoryName(product.category)}</span>
            </p>
            <p className="mt-4" style={{ whiteSpace: "pre-wrap" }}>
              {product.description}
            </p>

            <button
              onClick={handleAddToCart}
              className="btn btn-success w-100 mt-4 shadow"
              type="button"
            >
              🛒 أضف إلى السلة
            </button>
          </div>
        </div>

        <hr className="my-4 border-warning" />

        {/* Reviews */}
        <ProductReviews productId={product._id} />
      </div>

      <ScrollToTopButton />
    </>
  );
};

export default ProductDetailsPage;
