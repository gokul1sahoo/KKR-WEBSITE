const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [
    {
      option: String,
      votes: {
        type: Number,
        default: 0
      }
    }
  ],
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date
});

module.exports = mongoose.model('Poll', pollSchema);
