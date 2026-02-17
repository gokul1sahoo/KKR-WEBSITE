const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  matchNumber: Number,
  externalMatchId: String,
  source: String,
  date: Date,
  venue: String,
  homeTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  homeTeamName: String,
  awayTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  awayTeamName: String,
  homeTeamScore: Number,
  awayTeamScore: Number,
  result: String,
  winnerTeamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Live', 'Completed'],
    default: 'Upcoming'
  },
  highlights: String,
  liveScoreUrl: String,
  manOfMatch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
  manOfMatchName: String,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Match', matchSchema);
