const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');
const { authMiddleware } = require('../middleware/auth');

// @route   GET /api/admin/polls
// @desc    Get all polls
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/admin/polls
// @desc    Create new poll
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const poll = new Poll(req.body);
    await poll.save();
    res.status(201).json({ message: 'Poll created successfully', poll });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/admin/polls/:id
// @desc    Update poll
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const poll = await Poll.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }
    
    res.json({ message: 'Poll updated successfully', poll });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/admin/polls/:id
// @desc    Delete poll
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const poll = await Poll.findByIdAndDelete(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }
    
    res.json({ message: 'Poll deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/admin/polls/:id/reset-votes
// @desc    Reset poll votes
// @access  Private
router.put('/:id/reset-votes', authMiddleware, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Reset all votes to 0
    poll.options.forEach(option => {
      option.votes = 0;
    });
    poll.totalVotes = 0;
    await poll.save();

    res.json({ message: 'Poll votes reset successfully', poll });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
