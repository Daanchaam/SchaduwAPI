const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  winner: {
    type: Number,
  },
  cause: {
    type: String,
  },
  letPlayed: {
    type: Boolean,
    default: false
  },
  scoreAfter: {
    type: String
  }
});

module.exports = Point = mongoose.model('points', pointSchema);