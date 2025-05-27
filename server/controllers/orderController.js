import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const { cartItems, totalAmount, paymentMethod, phoneNumber } = req.body;

    // ✅ تحقق من المعطيات
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ msg: "Invalid total amount" });
    }

    const order = await Order.create({
      user: req.user.id,
      cartItems,
      totalAmount,
      phoneNumber,
      paymentMethod,
      isPaid: paymentMethod === 'online' ? true : false,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ msg: "Failed to create order" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ msg: "Failed to fetch orders" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch all orders" });
  }
};

export const markOrderDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    order.isDelivered = true;
    await order.save();

    res.json({ msg: "Marked as delivered" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update delivery status" });
  }
};
