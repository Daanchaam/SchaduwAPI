const Match = require('../models/matchModel');
const Sets = require('../models/setsModel');

const addGameToSet = async(gameId, setId) => {
  try {
    const currentSet = await Sets.findById(setId);
    if (currentSet.games.length === 13) {
      throw new Error('maybe we should start a new set');
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

finishSet = async(matchId, setId, score) => {
  let winner = (score.team1 > score.team2) ? 'team 1' : 'team 2';
  try {
    await Sets.findByIdAndUpdate(setId, { 'winner': winner });
    await createNewSet(matchId);
  } catch (error) {
    throw new Error('Something went wrong finishing the set' + error.message);
  }
};

createNewSet = async(matchId) => {
  try {
    // Code duplication m8
    const newGame = new Game({
      'startTime': Date.now()
    });
    const savedGame = await newGame.save();

    const newSet = new Sets({
      games: [{
        'id': savedGame._id
      }]
    });
    const savedSet = await newSet.save();
    console.log(savedSet);
    await Match.findByIdAndUpdate(matchId, { $push: { sets: { id: savedSet._id } } });
  } catch (error) {
    throw new Error('something went wrong creating the new set', error.message);
  }

};

module.exports = addGameToSet;