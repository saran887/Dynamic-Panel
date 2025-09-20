const express = require('express');
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');

const router = express.Router();

// Create a new category (user-specific)
router.post('/category', async (req, res) => {
  const { name, userId } = req.body;
  if (!name || !userId) return res.status(400).json({ message: 'Category name and userId are required' });
  try {
    const category = await Category.create({ name, userId });
    res.status(201).json({ message: 'Category created', category });
  } catch (err) {
    res.status(500).json({ message: 'Error creating category', error: err.message });
  }
});

// List all categories for a user
router.get('/category', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: 'userId is required' });
  try {
    const categories = await Category.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories', error: err.message });
  }
});

// Create a new product (must select category, user-specific)
router.post('/product', async (req, res) => {
  const { name, description, price, categoryId, userId } = req.body;
  if (!name || !price || !categoryId || !userId) {
    return res.status(400).json({ message: 'Name, price, categoryId, and userId are required' });
  }
  try {
    const product = await Product.create({ name, description, price, categoryId, userId });
    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    res.status(500).json({ message: 'Error creating product', error: err.message });
  }
});

// List all products for a user, optionally filter by category
router.get('/product', async (req, res) => {
  const { categoryId, userId } = req.query;
  if (!userId) return res.status(400).json({ message: 'userId is required' });
  try {
    const where = { userId };
    if (categoryId) where.categoryId = categoryId;
    const products = await Product.findAll({ where, include: Category, order: [['createdAt', 'DESC']] });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
});

module.exports = router;
