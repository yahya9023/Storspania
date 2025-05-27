import React, { useEffect, useState, useContext } from "react";
import { getArticles, createArticle, updateArticle, deleteArticle } from "../services/articles";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

export default function AdminArticlesPage() {
  const { token } = useContext(AuthContext);

  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [existingImages, setExistingImages] = useState([]);  // الصور القديمة كروابط
  const [imageFiles, setImageFiles] = useState([]);          // الصور الجديدة (ملفات)
  const [previewUrls, setPreviewUrls] = useState([]);        // معاينة الصور الجديدة
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await getArticles(token);
      setArticles(res.data);
      setLoading(false);
    } catch {
      toast.error("❌ فشل في جلب المقالات");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
  };

  const handleRemoveExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);

      // أرسل الصور القديمة كـ JSON string
      formData.append("existingImages", JSON.stringify(existingImages));

      // أرسل الصور الجديدة كملفات
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
        },
      };

      if (editingId) {
        await updateArticle(editingId, formData, config);
        toast.success("✅ تم تحديث المقال");
      } else {
        await createArticle(formData, config);
        toast.success("✅ تم إضافة المقال");
      }

      // إعادة تعيين الفورم والحالات
      setForm({ title: "", content: "" });
      setExistingImages([]);
      setImageFiles([]);
      setPreviewUrls([]);
      setEditingId(null);
      fetchArticles();
    } catch {
      toast.error("❌ حدث خطأ أثناء حفظ المقال");
    }
  };

  const handleEdit = (article) => {
    setForm({
      title: article.title,
      content: article.content,
    });
    setExistingImages(article.images || []);
    setImageFiles([]);
    setPreviewUrls([]);
    setEditingId(article._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("⚠️ هل أنت متأكد من حذف هذا المقال؟")) {
      try {
        await deleteArticle(id, { headers: { Authorization: token ? `Bearer ${token}` : "" } });
        toast.info("🗑️ تم حذف المقال");
        fetchArticles();
      } catch {
        toast.error("❌ فشل في حذف المقال");
      }
    }
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div className="container my-5">
      <h2 className="mb-4">{editingId ? "تعديل المقال" : "إضافة مقال جديد"}</h2>
      <form onSubmit={handleSubmit} className="mb-5">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="عنوان المقال"
          className="form-control mb-3"
          required
        />
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="محتوى المقال"
          rows={6}
          className="form-control mb-3"
          required
        />

        {/* عرض الصور القديمة مع زر حذف دائري صغير */}
        <div className="mb-3 d-flex gap-2 flex-wrap">
          {existingImages.map((url, i) => (
            <div key={i} style={{ position: "relative", width: 100, height: 100 }}>
              <img
                src={url}
                alt={`existing-${i}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 5 }}
              />
              <button
                type="button"
                onClick={() => handleRemoveExistingImage(url)}
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  backgroundColor: "rgba(255, 0, 0, 0.85)",
                  border: "none",
                  color: "white",
                  borderRadius: "50%",
                  cursor: "pointer",
                  width: 22,
                  height: 22,
                  fontWeight: "bold",
                  lineHeight: "22px",
                  textAlign: "center",
                  padding: 0,
                }}
                title="حذف الصورة"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        {/* رفع صور جديدة */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="form-control mb-3"
        />

        {/* معاينة الصور الجديدة */}
        <div className="d-flex gap-2 flex-wrap mb-3">
          {previewUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`preview-${i}`}
              style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 5 }}
            />
          ))}
        </div>

        <button type="submit" className="btn btn-warning">
          {editingId ? "حفظ التعديلات" : "إضافة مقال"}
        </button>
      </form>

      <h3 className="mb-3">قائمة المقالات</h3>
      {articles.length === 0 ? (
        <p>لا توجد مقالات.</p>
      ) : (
        <ul className="list-group">
          {articles.map((a) => (
            <li
              key={a._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <h5 className="mb-0">{a.title}</h5>
                {Array.isArray(a.images) && a.images.length > 0 && (
                  <div className="d-flex gap-2 mt-2 flex-wrap">
                    {a.images.map((imgUrl, idx) => (
                      <img
                        key={idx}
                        src={imgUrl}
                        alt={`article-img-${idx}`}
                        style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 5 }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => handleEdit(a)}
                  className="btn btn-primary btn-sm me-2"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(a._id)}
                  className="btn btn-danger btn-sm"
                >
                  حذف
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
