// routes/cart.js
const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// Get user's cart
router.get("/:userId", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId }).populate("products.productId");
  res.json(cart || { products: [] });
});

// Add item to cart
router.post("/:userId/add", async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ userId: req.params.userId });

  if (!cart) {
    cart = new Cart({ userId: req.params.userId, products: [] });
  }

  const existing = cart.products.find(p => p.productId.toString() === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.products.push({ productId, quantity });
  }

  await cart.save();
  res.json(cart);
});

// Remove item
router.delete("/:userId/remove/:productId", async (req, res) => {
  const cart = await Cart.findOneAndUpdate(
    { userId: req.params.userId },
    { $pull: { products: { productId: req.params.productId } } },
    { new: true }
  );
  res.json(cart);
});

// Clear cart
router.post("/:userId/clear", async (req, res) => {
  await Cart.findOneAndUpdate(
    { userId: req.params.userId },
    { $set: { products: [] } }
  );
  res.json({ message: "Cart cleared" });
});

module.exports = router;
