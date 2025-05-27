import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { getReviews, createReview } from "../services/reviewService";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editing, setEditing] = useState(false);
  const { user } = useAuthContext();

  const fetchReviews = useCallback(async () => {
    try {
      const data = await getReviews(productId);
      setReviews(data);
    } catch (err) {
      toast.error("❌ Failed to load reviews");
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const existingReview =
    user &&
    reviews.find((r) => r.user?._id === user.id || r.user === user.id);

  useEffect(() => {
    if (!editing) {
      setRating(5);
      setComment("");
    } else if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    }
  }, [editing, existingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("🚫 خاصك تسجل الدخول باش تكتب تقييم");

    try {
      if (editing && existingReview) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/reviews/${productId}`,
          { rating, comment },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        toast.success("✅ تم تعديل التقييم");
      } else {
        await createReview(productId, { rating, comment }, user.token);
        toast.success("✅ تم إرسال التقييم");
      }

      setRating(5);
      setComment("");
      setEditing(false);
      await fetchReviews();
    } catch (err) {
      toast.error("❌ فشل إرسال أو تعديل التقييم");
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      const confirmed = window.confirm("واخا متأكد بغيتي تحذف هاد التقييم؟");
      if (!confirmed) return;

      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/reviews/${reviewId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      toast.success("✅ تم حذف التقييم");
      await fetchReviews();
    } catch (err) {
      toast.error("❌ فشل الحذف");
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const fullStars = Math.round(averageRating);

  // دالة صغيرة ترسم النجوم باستعمال Bootstrap icons أو مجرد نصوص
  const renderStars = (count) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < count ? "text-warning" : "text-secondary"}>
        &#9733;
      </span>
    ));
  };

  return (
    <div className="mt-4 bg-white rounded shadow p-4">
      <h2 className="h4 mb-3">⭐ تقييمات الزبناء</h2>

      {reviews.length > 0 && (
        <div className="mb-3 d-flex align-items-center">
          <div className="fs-4">{renderStars(fullStars)}</div>
          <small className="text-muted ms-2">
            ({averageRating.toFixed(1)} / 5 من {reviews.length} تقييم)
          </small>
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-muted">ما كاين حتى تقييم دابا.</p>
      ) : (
        <div className="mb-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border-bottom pb-3 mb-3 position-relative"
            >
              <div className="d-flex justify-content-between align-items-center">
                <strong className="text-dark">
                  {review.user?.name || "مستخدم"}
                </strong>
                <div className="text-warning fs-5">
                  {renderStars(review.rating)}
                </div>
              </div>
              <p className="mb-1">{review.comment}</p>
              <small className="text-muted d-block mb-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </small>

              {user?.id &&
                (review.user?._id === user.id || review.user === user.id) && (
                  <div className="position-absolute top-0 end-0 d-flex gap-2 fs-6">
                    <button
                      onClick={() => {
                        setEditing(true);
                        window.scrollTo({
                          top: document.body.scrollHeight,
                          behavior: "smooth",
                        });
                      }}
                      className="btn btn-link p-0 text-primary"
                    >
                      ✏️ تعديل
                    </button>
                    <button
                      onClick={() => deleteReview(review._id)}
                      className="btn btn-link p-0 text-danger"
                    >
                      🗑️ حذف
                    </button>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}

      {user && (!existingReview || editing) && (
        <form onSubmit={handleSubmit} className="border-top pt-3">
          <h3 className="h5 mb-3 text-dark">
            {existingReview ? "✏️ عدّل تقييمك:" : "📝 أضف تقييمك:"}
          </h3>

          <div className="mb-3 fs-3 text-warning" style={{ cursor: "pointer" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                role="button"
                aria-label={`Rating ${star} stars`}
              >
                {star <= (hoveredRating || rating) ? "★" : "☆"}
              </span>
            ))}
          </div>

          <textarea
            className="form-control mb-3"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="اكتب تعليقك هنا..."
            required
          ></textarea>

          <button type="submit" className="btn btn-primary">
            {existingReview ? "💾 تحديث التقييم" : "📨 إرسال التقييم"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProductReviews;
