// models/Order.js
const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  price: Number
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [OrderItemSchema],
  address: String,
  paymentMethod: String, // 'COD' or 'Razorpay'
  totalAmount: Number,
  status: { type: String, default: 'Pending' },
  deliveryPartner: String, // assigned later
  razorpayOrderId: String,
  razorpayPaymentId: String
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
