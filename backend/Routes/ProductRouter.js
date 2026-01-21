const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const ensureAuthenticated = require("../Middlewares/Auth");
const Product = require("../Models/Product");

// ---------------- MULTER SETUP ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// ---------------- READ (USER IMAGES) ----------------
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const { search } = req.query;

    let query = { owner: req.user._id };

    if (search) {
      const tags = search
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      query.tags = { $in: tags };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- CREATE (UPLOAD + AI) ----------------
const { analyzeImageWithGemini } = require("../services/geminiVision");

router.post(
  "/",
  ensureAuthenticated,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }

      // Manual tags
      const manualTags = req.body.tags
        ? req.body.tags.split(",").map(t => t.trim()).filter(Boolean)
        : [];

      // 🔥 CALL GEMINI DIRECTLY
      const aiData = await analyzeImageWithGemini(
        req.file.path,
        req.file.mimetype
      );

      const product = new Product({
        imageUrl: `/uploads/${req.file.filename}`,
        description: aiData.description || "",
        tags: [...new Set([...manualTags, ...(aiData.tags || [])])],
        aiMetadata: JSON.stringify(aiData),
        owner: req.user._id
      });

      await product.save();

      res.status(201).json(product);

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// ---------------- DELETE (OWNER ONLY) ----------------
router.delete("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.json({ message: "Image deleted", deleted });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- UNIQUE TAGS (USER ONLY) ----------------
router.get("/tags", ensureAuthenticated, async (req, res) => {
  try {
    const products = await Product.find(
      { owner: req.user._id },
      "tags"
    );

    const tagSet = new Set();
    products.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));

    res.json([...tagSet]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
