const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  team1: [{
    name: {
      type: String,
    }
  }],
  team2: [{
    name: {
      type: String,
    }
  }],
  date: {
    startDate: {
      type: Date,
      default: Date.now()
    },
    endDate: {
      type: Date,
    }
  },
  sets: [{
    id: {
      type: String
    }
  }],
});

module.exports = Match = mongoose.model('match', matchSchema);