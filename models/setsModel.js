const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  winner: {
    type: String
  },
  games: [{
    id: {
      type: String
    }
  }]
});

module.exports = Sets = mongoose.model('sets', setSchema);