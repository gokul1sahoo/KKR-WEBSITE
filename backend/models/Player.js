const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  jerseyNumber: {
    type: Number,
    required: true
  },
  role: {
    type: String,
    enum: ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'],
    required: true
  },
  battingStyle: String,
  bowlingStyle: String,
  dateOfBirth: Date,
  nationality: String,
  profileImage: String,
  statistics: {
    matches: Number,
    runs: Number,
    wickets: Number,
    strikeRate: Number,
    bowlingAverage: Number
  },
  biography: String,
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Player', playerSchema);
