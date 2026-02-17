const Match = require('../models/Match');

// Get all matches
exports.getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('homeTeam')
      .populate('awayTeam')
      .populate('winnerTeamId')
      .populate('manOfMatch');
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get matches by team
exports.getMatchesByTeam = async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [
        { homeTeam: req.params.teamId },
        { awayTeam: req.params.teamId }
      ]
    })
      .populate('homeTeam')
      .populate('awayTeam')
      .populate('winnerTeamId')
      .populate('manOfMatch');
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get match by ID
exports.getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('homeTeam')
      .populate('awayTeam')
      .populate('winnerTeamId')
      .populate('manOfMatch');
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create match
exports.createMatch = async (req, res) => {
  const match = new Match(req.body);
  try {
    const savedMatch = await match.save();
    res.status(201).json(savedMatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update match
exports.updateMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('homeTeam')
      .populate('awayTeam');
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.json(match);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete match
exports.deleteMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.json({ message: 'Match deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
