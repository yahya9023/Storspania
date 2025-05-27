import Review from '../models/Review.js';

export const createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;

  try {
    // ✅ التحقق واش المستخدم سبق له قيّم هاد المنتوج
    const existing = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (existing) {
      return res.status(409).json({ message: '❌ راك سبق وقيّمت هاد المنتوج' });
    }

    // ✅ إنشاء تقييم جديد
    const review = new Review({
      user: req.user._id,
      product: productId,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json({ message: '✅ تم إضافة التقييم بنجاح', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '❌ خطأ أثناء إضافة التقييم' });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: '❌ خطأ أثناء جلب التقييمات' });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: "❌ خاص تعمر التقييم والتعليق" });
    }

    const review = await Review.findOne({ product: req.params.productId, user: req.user._id });

    if (!review) {
      return res.status(404).json({ message: "التقييم غير موجود" });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.json({ message: "✅ تم تعديل التقييم", review });
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ أثناء تعديل التقييم", error: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "❌ التقييم غير موجود" });
    }

    // ✅ تحقق أن المستخدم هو صاحب التقييم أو أدمن
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "🚫 غير مصرح ليك تحذف هاد التقييم" });
    }

    await review.deleteOne();
    res.json({ message: "✅ تم حذف التقييم" });
  } catch (err) {
    res.status(500).json({ message: "❌ فشل حذف التقييم" });
  }
};

// جلب كل التقييمات مع اسم المستخدم (populate)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "❌ خطأ أثناء جلب التقييمات" });
  }
};
