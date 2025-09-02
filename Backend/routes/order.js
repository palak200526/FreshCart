const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// In-memory pool of delivery partners
const DELIVERY_PARTNERS = [
  "Arjun",
  "Priya",
  "Rohan",
  "Neha",
  "Kabir",
  "Ishita",
  "Vikram",
  "Anaya",
  "Rahul",
  "Sara"
];

// Schedules an asynchronous assignment of a random partner within 10s
function scheduleDeliveryPartnerAssignment(orderId) {
  const delayMs = Math.floor(Math.random() * 10000); // 0–9999 ms
  setTimeout(async () => {
    try {
      const partner = DELIVERY_PARTNERS[Math.floor(Math.random() * DELIVERY_PARTNERS.length)];

      // Assign only if not already assigned
      await Order.findOneAndUpdate(
        { _id: orderId, $or: [ { deliveryPartner: { $exists: false } }, { deliveryPartner: null }, { deliveryPartner: "" } ] },
        { $set: { deliveryPartner: partner, status: "Assigned" } },
        { new: true }
      );
    } catch (err) {
      console.error("Delivery partner assignment error:", err);
    }
  }, delayMs);
}

// ✅ Place new order (supports both productId and product keys)
router.post("/", async (req, res) => {
  try {
    const { user, items, address, paymentMethod, totalAmount } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const normalizedItems = [];
    for (const item of items) {
      const product = item.product || item.productId || item.id;
      const quantity = item.quantity || item.qty;
      const price = item.price;
      if (!product || !quantity) {
        return res.status(400).json({ message: "Invalid item in order" });
      }
      normalizedItems.push({ product, quantity, price });
    }

    const order = new Order({
      user,
      items: normalizedItems,
      address,
      paymentMethod,
      totalAmount,
    });

    await order.save();
    // Kick off async partner assignment without blocking response
    scheduleDeliveryPartnerAssignment(order._id);
    res.json(order);
  } catch (err) {
    console.error("Order create error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// routes/orders.js
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate("items.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});


module.exports = router;
