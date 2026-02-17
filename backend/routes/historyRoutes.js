const express = require('express');
const router = express.Router();
const History = require('../models/History');

// @route   GET /api/history
// @desc    Get all history records
// @access  Public
router.get('/', async (req, res) => {
  try {
    const history = await History.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/history/:id
// @desc    Get single history record
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const history = await History.findById(req.params.id);
    if (!history) {
      return res.status(404).json({ error: 'History not found' });
    }
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
