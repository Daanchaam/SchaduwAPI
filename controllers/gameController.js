const Game = require('../models/gamesModel');
const addGameToSet = require('./setController');

const finishGame = async(gameWinner, gameId, setId) => {
  try {
    await Game.findByIdAndUpdate(gameId, { 'winner': gameWinner });
    const newGame = await createNewGame(setId);
    return { message: `Game won by ${gameWinner}`, newGameId: newGame.gameId };
  } catch (error) {
    throw new Error('Something went wrong trying to finish the game');
  }
};

const createNewGame = async(setId) => {
  const newGame = new Game({
    'startTime': Date.now()
  });
  const savedGame = await newGame.save();
  try {
    return await addGameToSet(savedGame._id, setId);
  } catch (error) {
    throw new Error('Something went wrong adding the game to the set');
  }
};

module.exports = finishGame;