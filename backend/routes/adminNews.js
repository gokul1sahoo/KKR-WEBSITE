const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const News = require('../models/News');
const { authMiddleware } = require('../middleware/auth');

// Configure multer for news image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../frontend/public/images/news');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `news-${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// @route   GET /api/admin/news
// @desc    Get all news
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const news = await News.find().sort({ publishedAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/admin/news
// @desc    Create new news article
// @access  Private
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const newsData = req.body;
    
    // If image was uploaded, add image URL
    if (req.file) {
      newsData.image = `/images/news/${req.file.filename}`;
    }
    
    const news = new News(newsData);
    await news.save();
    res.status(201).json({ message: 'News created successfully', news });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/admin/news/:id
// @desc    Update news article
// @access  Private
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const newsData = req.body;
    
    // If new image was uploaded, add image URL
    if (req.file) {
      newsData.image = `/images/news/${req.file.filename}`;
    }
    
    const news = await News.findByIdAndUpdate(
      req.params.id,
      newsData,
      { new: true, runValidators: true }
    );
    
    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }
    
    res.json({ message: 'News updated successfully', news });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/admin/news/:id
// @desc    Delete news article
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    
    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }
    
    // Optionally delete the image file
    if (news.image && news.image.startsWith('/images/news/')) {
      const imagePath = path.join(__dirname, '../../frontend/public', news.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
