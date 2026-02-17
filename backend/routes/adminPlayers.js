const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Player = require('../models/Player');
const { authMiddleware } = require('../middleware/auth');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../frontend/public/images/players');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate filename: playername-jersey.ext
    const ext = path.extname(file.originalname);
    const filename = `${req.body.slug || Date.now()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|avif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// @route   GET /api/admin/players
// @desc    Get all players (with full details)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const players = await Player.find().sort({ name: 1 });
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/admin/players
// @desc    Create new player
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();
    res.status(201).json({ message: 'Player created successfully', player });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/admin/players/:id
// @desc    Update player
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json({ message: 'Player updated successfully', player });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/admin/players/:id
// @desc    Delete player
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/admin/players/:id/upload-image
// @desc    Upload player image
// @access  Private
router.post('/:id/upload-image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Update player's profile image
    const imageUrl = `/images/players/${req.file.filename}`;
    player.profileImage = imageUrl;
    await player.save();

    res.json({ 
      message: 'Image uploaded successfully', 
      imageUrl,
      player 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/admin/players/:id/stats
// @desc    Update player statistics
// @access  Private
router.put('/:id/stats', authMiddleware, async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Update statistics
    player.statistics = { ...player.statistics, ...req.body };
    await player.save();

    res.json({ message: 'Statistics updated successfully', player });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
