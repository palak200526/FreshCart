// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imageUrl: String,
  category: String,
  stock: { type: Number, default: 999 }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
