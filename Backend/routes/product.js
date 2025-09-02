// routes/product.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all
router.get('/', async (req, res) => {
  try { const products = await Product.find(); res.json(products); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// CREATE
router.post('/', async (req, res) => {
  try { const p = new Product(req.body); await p.save(); res.status(201).json(p); }
  catch (e) { res.status(400).json({ error: e.message }); }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try { await Product.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (e) { res.status(400).json({ error: e.message }); }
});

module.exports = router;
