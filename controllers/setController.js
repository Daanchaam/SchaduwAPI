const Sets = require('../models/setsModel');

const addGameToSet = async(gameId, setId) => {
  try {
    const currentSet = await Sets.findById(setId);
    if (currentSet.games.length === 13) {
      console.log('maybe we should start a new set');
    }
    await Sets.findByIdAndUpdate(setId, { $push: { games: { id: gameId } } });
    return { message: 'Game added to set!', gameId: gameId, setId: setId };
  } catch (error) {
    throw new Error('something went wrong updating the set');
  }
};

updateSetScore = async(gameWinner, setId) => {
  try {
    const currentSet = await Sets.findById(setId);
    let currentScore = currentSet.score;
    let addScore;
    if (gameWinner === 1) {
      addScore = {
        team1: currentScore.team1 + 1,
        team2: currentScore.team2
      };
    } else {
      addScore = {
        team1: currentScore.team1,
        team2: currentScore.team2 + 1
      };
    }
    await Sets.findByIdAndUpdate(setId, { 'score': addScore });
    return addScore;
  } catch (error) {
    throw new Error('Something went wrong updating the set score', error.message);
  }
};

finishSet = async(setId, score) => {
  let winner = (score.team1 === 6) ? 'team 1' : 'team 2';
  try {
    await Sets.findByIdAndUpdate(setId, { 'winner': winner });
  } catch (error) {
    throw new Error('Something went wrong finishing the set' + error.message);
  }
};

module.exports = addGameToSet;