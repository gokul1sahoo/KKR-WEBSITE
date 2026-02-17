const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: String,
  author: String,
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  category: {
    type: String,
    enum: ['Transfer', 'Match Report', 'Injury', 'Achievement', 'General'],
    default: 'General'
  },
  views: {
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('News', newsSchema);
