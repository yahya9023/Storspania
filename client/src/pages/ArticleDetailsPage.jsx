import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getArticleById } from "../services/articles"; // تأكد من أنك قد قمت بتعريف هذه الدالة بشكل صحيح

export default function ArticleDetailsPage() {
  const { id } = useParams();  // الحصول على الـ id من الـ URL
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticleById(id)  // جلب المقال بناءً على الـ id
      .then((res) => {
        setArticle(res.data);  // تخزين المقال في الحالة
        setLoading(false);  // إيقاف التحميل
      })
      .catch(() => setLoading(false));  // في حال حدوث خطأ
  }, [id]);

  // إذا كانت المقالة في حالة تحميل
  if (loading) return <div className="text-center my-5">جاري التحميل...</div>;

  // إذا لم يتم العثور على المقال
  if (!article) return <div className="text-center my-5">المقال غير موجود</div>;

  return (
    <div className="container my-5 px-3">
      <h1 className="display-4 fw-bold mb-4 text-center">{article.title}</h1>  {/* توسيط العنوان هنا */}

      {/* عرض الصور إذا كانت موجودة */}
      {article.images && article.images.length > 0 && (
        <div className="mb-4">
          {article.images.map((imageUrl, index) => (
            <img
              key={index}
              src={imageUrl}
              alt={`Article Image ${index + 1}`}
              className="img-fluid rounded mb-3"
              style={{ width: "100%", objectFit: "cover", maxHeight: "400px" }}
            />
          ))}
        </div>
      )}

      {/* عرض المحتوى النصي للمقال */}
      <p style={{ whiteSpace: "pre-line" }}>{article.content}</p>
    </div>
  );
}
