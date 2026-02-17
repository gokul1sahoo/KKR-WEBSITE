const Player = require('../models/Player');

// Get all players
exports.getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find().populate('teamId');
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get players by team
exports.getPlayersByTeam = async (req, res) => {
  try {
    const players = await Player.find({ teamId: req.params.teamId }).populate('teamId');
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get player by ID
exports.getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).populate('teamId');
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create player
exports.createPlayer = async (req, res) => {
  const player = new Player(req.body);
  try {
    const savedPlayer = await player.save();
    res.status(201).json(savedPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update player
exports.updatePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete player
exports.deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.json({ message: 'Player deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
