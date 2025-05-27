import express from 'express';
import { createReview, getProductReviews, updateReview , deleteReview, getAllReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/', getAllReviews); // راح يرد جميع التقييمات


router.post('/:productId', protect, createReview);
router.get('/:productId', getProductReviews);
router.put("/:productId", protect, updateReview);
router.delete('/:reviewId', protect, deleteReview);


export default router;
