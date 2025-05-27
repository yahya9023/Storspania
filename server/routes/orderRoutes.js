import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createOrder, getMyOrders, getAllOrders, markOrderDelivered } from '../controllers/orderController.js';
import { isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ route لإنشاء الطلب
router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);

router.get('/all', protect, isAdmin, getAllOrders); // ✅ كل الطلبات
router.put('/:id/deliver', protect, isAdmin, markOrderDelivered); // ✅ تحديد كتوصيل

export default router;
