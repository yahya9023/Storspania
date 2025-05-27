import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // استيراد useParams للحصول على id من URL

function ArticlePage() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // الحصول على id من URL

  useEffect(() => {
    // جلب المقال من API بناءً على ID
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/articles/${id}`);
        setArticle(response.data);  // تخزين المقال في الحالة
        setLoading(false);
      } catch (error) {
        console.error("Error fetching article:", error);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  if (!article) {
    return <div>المقال غير موجود</div>;
  }

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>

      {/* عرض الصورة إذا كانت موجودة */}
      {article.images && article.images.length > 0 && (
        <img src={article.images[0]} alt="Article Image" style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }} />
      )}

      {/* عرض الصور الأخرى إذا كانت موجودة */}
      {article.images && article.images.slice(1).map((img, idx) => (
        <img key={idx} src={img} alt={`article-image-${idx}`} style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }} />
      ))}
    </div>
  );
}

export default ArticlePage;
