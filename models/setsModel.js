const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  winner: {
    type: String
  },
  score: {
    team1: {
      type: Number,
      default: 0
    },
    team2: {
      type: Number,
      default: 0
    }
  },
  games: [{
    id: {
      type: String
    }
  }]
});

module.exports = Sets = mongoose.model('sets', setSchema);