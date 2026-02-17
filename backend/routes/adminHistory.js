const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const History = require('../models/History');
const { authMiddleware } = require('../middleware/auth');

// Configure multer for history image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../frontend/public/images/history');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `history-${Date.now()}${ext}`;
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

// @route   GET /api/admin/history
// @desc    Get all history records
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const history = await History.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/admin/history
// @desc    Create new history record
// @access  Private
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const historyData = req.body;
    
    // If image was uploaded, add image URL
    if (req.file) {
      historyData.image = `/images/history/${req.file.filename}`;
    }
    
    const history = new History(historyData);
    await history.save();
    res.status(201).json({ message: 'History created successfully', history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/admin/history/:id
// @desc    Update history record
// @access  Private
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const historyData = req.body;
    
    // If new image was uploaded, add image URL
    if (req.file) {
      historyData.image = `/images/history/${req.file.filename}`;
    }
    
    const history = await History.findByIdAndUpdate(
      req.params.id,
      historyData,
      { new: true, runValidators: true }
    );
    
    if (!history) {
      return res.status(404).json({ error: 'History not found' });
    }
    
    res.json({ message: 'History updated successfully', history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/admin/history/:id
// @desc    Delete history record
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const history = await History.findByIdAndDelete(req.params.id);
    
    if (!history) {
      return res.status(404).json({ error: 'History not found' });
    }
    
    res.json({ message: 'History deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
