import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

export default function ReviewsCarousel() {
  const [reviews, setReviews] = useState([]);
  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      .get(`${API}/api/reviews`)
      .then((res) => {
        console.log("Reviews API response:", res.data);
        setReviews(res.data);
      })
      .catch((err) => console.error("Failed to load reviews:", err));
  }, [API]);

  const getUserName = (user) => user?.name || "مستخدم مجهول";

  return (
    <section className="my-4 container px-3">
      <h2 className="mb-4 text-center fw-bold text-dark" style={{ fontSize: '1.75rem' }}>💬 آراء العملاء</h2>
      {reviews.length === 0 ? (
        <p className="text-center text-secondary">لا توجد آراء لعرضها حالياً.</p>
      ) : (
        <Swiper
          slidesPerView={3}
          spaceBetween={24}
          freeMode={true}
          grabCursor={true}
          modules={[FreeMode]}
          className="reviews-swiper"
        >
          {reviews.map((review) => {
            const rating = review.rating || 0;
            return (
              <SwiperSlide key={review._id}>
                <div className="card h-100 shadow-sm rounded-3">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h3 className="card-title fw-semibold mb-2" style={{ fontSize: '1.25rem' }}>
                        {getUserName(review.user)}
                      </h3>
                      <div className="mb-3">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            fill={i < rating ? "currentColor" : "none"}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            className={i < rating ? "text-warning" : "text-muted"}
                            style={{ marginRight: '2px' }}
                          >
                            <path d="M12 .587l3.668 7.431L24 9.753l-6 5.854 1.417 8.263L12 18.896l-7.417 4.974L6 15.607 0 9.753l8.332-1.735z" />
                          </svg>
                        ))}
                      </div>
                      <p className="card-text fst-italic text-secondary">"{review.comment}"</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </section>
  );
}
