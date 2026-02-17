const Poll = require('../models/Poll');

// Get all polls
exports.getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find().populate('teamId');
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get active polls
exports.getActivePolls = async (req, res) => {
  try {
    const polls = await Poll.find({ active: true }).populate('teamId');
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get poll by ID
exports.getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).populate('teamId');
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create poll
exports.createPoll = async (req, res) => {
  const poll = new Poll(req.body);
  try {
    const savedPoll = await poll.save();
    res.status(201).json(savedPoll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Vote on poll
exports.votePoll = async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const poll = await Poll.findById(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    
    if (optionIndex >= 0 && optionIndex < poll.options.length) {
      poll.options[optionIndex].votes += 1;
      await poll.save();
      res.json(poll);
    } else {
      res.status(400).json({ message: 'Invalid option' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update poll
exports.updatePoll = async (req, res) => {
  try {
    const poll = await Poll.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.json(poll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete poll
exports.deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findByIdAndDelete(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.json({ message: 'Poll deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
