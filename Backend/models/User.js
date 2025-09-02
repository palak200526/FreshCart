// models/User.js
const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, default: 1 }
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  address: String,
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  cart: [CartItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
