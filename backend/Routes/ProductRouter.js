const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const ensureAuthenticated = require('../Middlewares/Auth');
const Product = require('../Models/Product');

// ---------------- Multer setup ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ---------------- READ ----------------
// GET /products?search=tag1,tag2
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      const tags = search.split(',').map(t => t.trim()).filter(t => t !== '');
      query = { tags: { $in: tags } }; // find images containing any of the tags
    }
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------------- CREATE ----------------
router.post('/', ensureAuthenticated, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image is required' });

    const { tags } = req.body; // comma-separated string
    const tagArray = tags ? tags.split(',').map(t => t.trim()).filter(t => t !== '') : [];

    const product = new Product({
      imageUrl: `/uploads/${req.file.filename}`,
      tags: tagArray,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------------- DELETE ----------------
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Image not found' });

    res.json({ message: 'Image deleted', deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------------- UNIQUE TAGS ----------------
// GET /products/tags
router.get('/tags', ensureAuthenticated, async (req, res) => {
  try {
    const products = await Product.find({}, 'tags'); // only get tags
    const allTags = new Set();
    products.forEach(p => p.tags.forEach(tag => allTags.add(tag)));
    res.json([...allTags]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
