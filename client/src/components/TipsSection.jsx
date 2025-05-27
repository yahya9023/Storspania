import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";  // تأكد من أنك قد قمت بتثبيت axios

function TipsSection() {
  const [articles, setArticles] = useState([]);  // الحالة لتخزين المقالات
  const [loading, setLoading] = useState(true);   // حالة تحميل المقالات

  useEffect(() => {
    // استرجاع المقالات من API عند تحميل الصفحة
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/articles");  // رابط API لجلب المقالات
        setArticles(response.data);  // تخزين المقالات في الحالة
        setLoading(false);  // إيقاف التحميل
      } catch (error) {
        console.error("Error fetching articles:", error);
        setLoading(false);  // إيقاف التحميل في حال حدوث خطأ
      }
    };

    fetchArticles();
  }, []);  // فقط يتم استدعاء الدالة عند تحميل المكون لأول مرة

  if (loading) {
    return <div>جاري التحميل...</div>;  // عرض رسالة تحميل أثناء استرجاع المقالات
  }

  return (
    <section className="container py-5">
      <h2 className="mb-4 text-center fw-bold" style={{ fontSize: "2rem", color: "#343a40" }}>
        نصائح ومقالات
      </h2>
      <div className="row g-4">
        {articles.map(({ _id, title, content, images }) => (
          <div key={_id} className="col-12 col-sm-6 col-md-4">
            <Link
              to={`/articles/${_id}`}  // رابط المقال باستخدام الـ ID
              className="card h-100 text-decoration-none shadow-sm"
              style={{ transition: "box-shadow 0.3s ease" }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0.5rem 1rem rgba(0,0,0,0.15)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 .125rem .25rem rgba(0,0,0,.075)")}
            >
              <img
                src={images && images[0]}  // عرض أول صورة من الصور في المقال
                alt={title}
                className="card-img-top"
                style={{ height: "160px", objectFit: "cover" }}
              />
              <div className="card-body text-dark">
                <h5 className="card-title">{title}</h5>
                <p className="card-text small">{content.slice(0, 100)}...</p> {/* عرض بداية المحتوى */}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TipsSection;
