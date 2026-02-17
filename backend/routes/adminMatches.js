const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const { authMiddleware } = require('../middleware/auth');

// @route   GET /api/admin/matches
// @desc    Get all matches
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('homeTeam')
      .populate('awayTeam')
      .populate('winnerTeamId')
      .populate('manOfMatch')
      .sort({ date: -1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/admin/matches
// @desc    Create new match
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const match = new Match(req.body);
    await match.save();
    res.status(201).json({ message: 'Match created successfully', match });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/admin/matches/:id
// @desc    Update match
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('homeTeam')
      .populate('awayTeam')
      .populate('winnerTeamId')
      .populate('manOfMatch');

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    res.json({ message: 'Match updated successfully', match });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/admin/matches/:id
// @desc    Delete match
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    res.json({ message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
