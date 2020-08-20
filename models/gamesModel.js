const mongoose = require('mongoose');

const gamesSchema = new mongoose.Schema({
  serving: {
    type: String,
  },
  tieBreak: {
    type: Boolean,
    default: false
  },
  winner: {
    type: String
  },
  startTime: {
    type: Date
  },
  scoreAfter: {
    type: String
  },
  points: [{
    id: {
      type: String
    }
  }],
});

module.exports = Game = mongoose.model('games', gamesSchema);