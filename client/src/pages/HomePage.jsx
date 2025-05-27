import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/free-mode";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import ReviewsCarousel from "../components/ReviewsCarousel";
import ScrollToTopButton from "../components/ScrollToTopButton";
import TipsSection from "../components/TipsSection";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { cart, addToCart } = useCart();
  const API = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/api/categories`).then((res) => setCategories(res.data));
    axios.get(`${API}/api/products`).then((res) => setProducts(res.data));
  }, [API]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const exists = cart.find((item) => item._id === product._id);
    if (exists) {
      toast.info("🔄 هذا المنتج موجود مسبقاً في السلة");
    } else {
      addToCart(product);
      toast.success("✅ تم إضافة المنتج إلى السلة");
    }
  };

  const getCategoryName = (id) => {
    const match = categories.find((cat) => cat._id === id);
    return match ? match.name : "غير معروف";
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMinPrice = minPrice === "" || p.price >= Number(minPrice);
    const matchesMaxPrice = maxPrice === "" || p.price <= Number(maxPrice);
    return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice;
  });

  const newestProducts = products
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      {/* Hero */}
      <section className="text-center py-5 bg-primary shadow-sm">
        <h1 className="display-4 fw-bold text-white mb-3">مرحباً بك في <span className="text-warning fw-bolder">SpainStore!</span></h1>
        <p className="lead text-white mx-auto" style={{ maxWidth: "600px" }}>
          استمتع بأفضل العروض والتخفيضات على المنتجات الحصرية.
        </p>
        <button
          className="btn btn-warning btn-lg mt-4 rounded-pill"
          style={{
            transition: "all 0.3s ease",
            transform: "scale(1)",
            padding: "12px 30px",
            fontSize: "18px",
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          اكتشف الآن
        </button>
      </section>

      <main className="container my-5 flex-grow-1">
        {/* Categories Carousel */}
        <section className="mb-4">
          <h2 className="h3 mb-3 text-secondary">📁 الأقسام</h2>
          <Swiper
            slidesPerView={6}
            spaceBetween={15}
            freeMode={true}
            modules={[FreeMode]}
            className="pb-3"
            style={{ cursor: "grab" }}
          >
            <SwiperSlide>
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`btn w-100 rounded-pill fw-semibold ${activeCategory === "all" ? "btn-warning text-white" : "btn-outline-warning text-warning"}`}
              >
                الكل
              </button>
            </SwiperSlide>
            {categories.map((cat) => (
              <SwiperSlide key={cat._id}>
                <button
                  type="button"
                  onClick={() => setActiveCategory(cat._id)}
                  className={`btn w-100 rounded-pill fw-semibold ${activeCategory === cat._id ? "btn-warning text-white" : "btn-outline-warning text-warning"}`}
                >
                  {cat.name}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Search & Filters */}
        <section className="mb-4 d-flex flex-wrap gap-3 justify-content-center">
          <input
            type="text"
            placeholder="ابحث بالاسم..."
            className="form-control flex-grow-1"
            style={{ maxWidth: "300px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="number"
            placeholder="السعر الأدنى"
            className="form-control"
            style={{ maxWidth: "150px" }}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="السعر الأقصى"
            className="form-control"
            style={{ maxWidth: "150px" }}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </section>

        {/* Filtered Products */}
        <section>
          <h2 className="h3 mb-4 text-secondary">🛍️ المنتجات</h2>
          {filteredProducts.length === 0 ? (
            <p className="text-center text-muted">لا توجد منتجات لعرضها.</p>
          ) : (
            <div className="row gy-4">
              {filteredProducts.map((p) => {
                const rating = Math.round(p.rating || 0);
                return (
                  <div
                    key={p._id}
                    onClick={() => navigate(`/product/${p._id}`)}
                    className="col-12 col-sm-6 col-md-4 col-lg-3"
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card h-100 shadow-sm hover-shadow">
                      <img
                        src={p.images?.[0] || "https://via.placeholder.com/300x200"}
                        alt={p.name}
                        className="card-img-top rounded-3"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <div className="card-body d-flex flex-column">
                        <div className="text-muted small fw-bold mb-1">📦 القسم: {getCategoryName(p.category)}</div>
                        <h5 className="card-title text-truncate">{p.name}</h5>
                        <p className="text-warning fw-bold fs-5">{p.price} €</p>
                        <div className="mb-2">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              fill={i < rating ? "currentColor" : "none"}
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              className={`bi bi-star-fill ${i < rating ? "text-warning" : "text-muted"}`}
                              style={{ width: "1.1rem", height: "1.1rem" }}
                            >
                              <path d="M12 .587l3.668 7.431L24 9.753l-6 5.854 1.417 8.263L12 18.896l-7.417 4.974L6 15.607 0 9.753l8.332-1.735z" />
                            </svg>
                          ))}
                        </div>
                        <button
                          onClick={(e) => handleAddToCart(e, p)}
                          className="btn btn-success mt-auto"
                          style={{
                            transition: "all 0.3s ease",
                            transform: "scale(1)",
                            padding: "12px 30px",
                            fontSize: "18px",
                          }}
                        >
                          🛒 أضف إلى السلة
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Customer Reviews Carousel */}
        <ReviewsCarousel />

        {/* Newest Products Section */}
        <section className="mt-5">
          <h2 className="h3 mb-4 text-secondary">🆕 أحدث المنتجات</h2>
          <div className="row gy-4">
            {newestProducts.map((p) => {
              const rating = Math.round(p.rating || 0);
              return (
                <div
                  key={p._id}
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="col-12 col-sm-6 col-md-4"
                  style={{ cursor: "pointer" }}
                >
                  <div className="card h-100 shadow-sm hover-shadow">
                    <img
                      src={p.images?.[0] || "https://via.placeholder.com/300x200"}
                      alt={p.name}
                      className="card-img-top rounded-3"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <div className="text-muted small fw-bold mb-1">📦 القسم: {getCategoryName(p.category)}</div>
                      <h5 className="card-title text-truncate">{p.name}</h5>
                      <p className="text-warning fw-bold fs-5">{p.price} €</p>
                      <div className="mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            fill={i < rating ? "currentColor" : "none"}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            className={`bi bi-star-fill ${i < rating ? "text-warning" : "text-muted"}`}
                            style={{ width: "1.1rem", height: "1.1rem" }}
                          >
                            <path d="M12 .587l3.668 7.431L24 9.753l-6 5.854 1.417 8.263L12 18.896l-7.417 4.974L6 15.607 0 9.753l8.332-1.735z" />
                          </svg>
                        ))}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(e, p);
                        }}
                        className="btn btn-success mt-auto"
                        style={{
                          transition: "all 0.3s ease",
                          transform: "scale(1)",
                          padding: "12px 30px",
                          fontSize: "18px",
                        }}
                      >
                        🛒 أضف إلى السلة
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Tips Section */}
        <TipsSection />
      </main>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
}
