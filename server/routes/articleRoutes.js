import express from 'express';
import parser from '../utils/multer.js'; // استيراد multer
import Article from '../models/Article.js'; // استيراد نموذج المقالات
import { getArticles, getArticleById, createArticle, updateArticle } from '../controllers/articleController.js'; // استيراد دوال التحكم في المقالات

const router = express.Router();

// مسار لجلب المقالات
router.get('/', getArticles);  // إضافة هذا المسار لجلب المقالات
router.get('/:id', getArticleById);  // إضافة هذا المسار لجلب مقال بناءً على ID

// مسار لإنشاء مقال
router.post('/', parser.array('images', 10), (req, res) => {
  console.log("Form Data:", req.body);  // طباعة البيانات المرسلة
  console.log("Uploaded Files:", req.files);  // طباعة الصور المرفوعة

  // التأكد من أن الصور تم رفعها بنجاح
  const images = req.files.map(file => file.path);  // استخراج روابط الصور

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
    images,  // تخزين روابط الصور في قاعدة البيانات
  });

  newArticle.save()
    .then((article) => res.status(201).json(article))
    .catch((error) => res.status(500).json({ message: 'Error creating article', error: error.message }));
});

// مسار لتحديث مقال
router.put('/:id', parser.array('images', 10), (req, res) => {
  console.log("Form Data:", req.body);
  console.log("Uploaded Files:", req.files);

  const images = req.files.map(file => file.path);  // استخراج روابط الصور

  // تحديث المقال في قاعدة البيانات
  Article.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    content: req.body.content,
    images,  // تخزين روابط الصور في قاعدة البيانات
  }, { new: true })
    .then((updatedArticle) => res.status(200).json(updatedArticle))
    .catch((error) => res.status(500).json({ message: 'Error updating article', error: error.message }));
});

// مسار لحذف مقال
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  Article.findByIdAndDelete(id)
    .then((deletedArticle) => {
      if (!deletedArticle) {
        return res.status(404).json({ message: "المقال غير موجود" });
      }
      res.json({ message: "تم حذف المقال بنجاح" });
    })
    .catch((error) => {
      res.status(500).json({ message: "حدث خطأ أثناء حذف المقال", error: error.message });
    });
});

export default router;
