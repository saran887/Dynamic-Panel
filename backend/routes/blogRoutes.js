const express = require('express');
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blogModel');

const router = express.Router();

// Multer storage config for blog images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.svg'].includes(ext)) {
      return cb(new Error('Only jpg, jpeg, png, svg files are allowed'));
    }
    cb(null, 'blog_' + Date.now() + ext);
  }
});
const upload = multer({ storage });

// POST /api/blog - create a new blog post with image and userId
router.post('/', upload.single('image'), async (req, res) => {
  const { title, description, userId } = req.body;
  if (!title || !description || !userId) {
    return res.status(400).json({ message: 'Title, description, and userId are required' });
  }
  let imagePath = null;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
  }
  try {
    const blog = await Blog.create({ title, description, image: imagePath, userId });
    res.status(201).json({ message: 'Blog post created', blog });
  } catch (err) {
    res.status(500).json({ message: 'Error creating blog post', error: err.message });
  }
});

// GET /api/blog/user/:userId - fetch all blogs for a user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const blogs = await Blog.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blogs', error: err.message });
  }
});

module.exports = router;
