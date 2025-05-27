import Article from "../models/Article.js";

// جلب جميع المقالات
export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 }); // حديث -> قديم
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب المقالات" });
  }
};

// جلب مقال واحد حسب id
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "المقال غير موجود" });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب المقال" });
  }
};

// إنشاء مقال جديد
export const createArticle = async (req, res) => {
  try {
    const { title, content, images } = req.body; // images كـ array ديال روابط

    if (!title || !content) {
      return res.status(400).json({ message: "العنوان والمحتوى مطلوبان" });
    }

    const newArticle = new Article({ title, content, images });
    await newArticle.save();

    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء إنشاء المقال" });
  }
};

// تحديث مقال
export const updateArticle = async (req, res) => {
  try {
    const { title, content, images } = req.body;
    const article = await Article.findById(req.params.id);

    if (!article) return res.status(404).json({ message: "المقال غير موجود" });

    article.title = title || article.title;
    article.content = content || article.content;
    article.images = images || article.images;

    await article.save();

    res.json(article);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء تحديث المقال" });
  }
};

// حذف مقال
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: "المقال غير موجود" });

    res.json({ message: "تم حذف المقال بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء حذف المقال" });
  }
};
