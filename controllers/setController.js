const Sets = require('../models/setsModel');

const addGameToSet = async(gameId, setId) => {
  try {
    await Sets.findByIdAndUpdate(setId, { $push: { games: { id: gameId } } });
    return { message: 'Game added to set!', gameId: gameId, setId: setId };
  } catch (error) {
    throw new Error('something went wrong updating the set');
  }
};

module.exports = addGameToSet;