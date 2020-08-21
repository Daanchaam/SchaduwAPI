const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  winner: {
    type: Number,
  },
  cause: {
    type: String,
  },
  /**
   * This one is only used in double matches, since in singles we can derive the player from the cause
   */
  playerCaused: {
    type: String
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