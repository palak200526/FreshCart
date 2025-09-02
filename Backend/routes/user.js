// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// register
// Accepts optional "role" only for quick setup/dev. In production remove or restrict this.
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User exists' });
    const hashed = await bcrypt.hash(password, 10);
    const u = new User({ name, email, password: hashed, address, role: role || 'customer' });
    await u.save();
    res.status(201).json({ message: 'Registered' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if (!u) return res.status(404).json({ message: 'User not found' });
    const ok = await bcrypt.compare(password, u.password);
    if (!ok) return res.status(401).json({ message: 'Wrong password' });
    const token = jwt.sign({ userId: u._id, role: u.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({
      message: 'Login success',
      token,
      userId: u._id,
      name: u.name,
      address: u.address,
      role: u.role
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// list all users (for admin panel). SELECT password excluded.
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// get user by id
router.get('/:id', async (req, res) => {
  try { const u = await User.findById(req.params.id).select('-password'); res.json(u); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// clear cart
router.put('/:id/cart/clear', async (req, res) => {
  try { const u = await User.findByIdAndUpdate(req.params.id, { cart: [] }, { new: true }); res.json(u); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

/*
  Promote user to a role (e.g., admin).
  IMPORTANT: This endpoint is UNPROTECTED for convenience in development.
  In production, protect it with auth middleware and ensure only admins can call it.
*/
router.post('/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const u = await User.findByIdAndUpdate(req.params.id, { role }, { new: true, runValidators: true }).select('-password');
    res.json(u);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;