import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cartItems: [
    {
      _id: String,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalAmount: Number,
  paymentMethod: {
    type: String,
    enum: ['cod', 'online'],
    default: 'cod',
  },
  phoneNumber: {
      type: String, // إضافة حقل رقم الهاتف
      required: function() { return this.paymentMethod === 'cod'; }, // رقم الهاتف مطلوب فقط عند الدفع نقدًا عند التسليم
    },
  isPaid: { type: Boolean, default: false },
  isDelivered: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);