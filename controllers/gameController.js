const Game = require('../models/gamesModel');
const addGameToSet = require('./setController');

const finishGame = async(gameWinner, gameId, setId, matchId) => {
  try {
    await Game.findByIdAndUpdate(gameId, { 'winner': `team ${gameWinner}` });
    const score = await updateSetScore(gameWinner, setId);
    // Tiebreak time!
    if (score.team1 === score.team2 === 6) {
      createNewGame(setId, true);
    }
    if (score.team1 === 6 || score.team2 === 6) {
      if (score.team1 === 5 || score.team2 === 5) {
        await createNewGame(setId, false);
      } else {
        finishSet(matchId, setId, score);
      }
    } else {
      await createNewGame(setId, false);
    }
    return { message: `Game won by team ${gameWinner}`, score: score };
  } catch (error) {
    throw new Error('Something went wrong trying to finish the game', error.message);
  }
};

const createNewGame = async(setId, tiebreak) => {
  let newGame;
  if (tiebreak) {
    newGame = new Game({
      'startTime': Date.now(),
      'tiebreak': true
    });
  } else {
    newGame = new Game({
      'startTime': Date.now()
    });
  }
  const savedGame = await newGame.save();
  try {
    return await addGameToSet(savedGame._id, setId);
  } catch (error) {
    throw new Error('Something went wrong adding the game to the set');
  }
};

module.exports = finishGame;