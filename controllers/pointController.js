const Match = require('../models/matchModel');
const Sets = require('../models/setsModel');
const Game = require('../models/gamesModel');
const Point = require('../models/pointsModel');
const calculateScore = require('./scoreController');
/**
 * Add point to a game given the point structure and the ID of match and game
 */
const addPoint = async(req, res) => {
  let { winner, cause, letPlayed, matchId, setId, gameId } = req.body;

  // Validation
  if (!winner || !cause) {
    return res.status(400).json({
      message: `Not all fields have been filled in ${req.body}`
    });
  }
  const existingMatch = await Match.findById(matchId);
  if (!existingMatch) {
    return res.status(400).json({
      message: 'Match does not exist'
    });
  }
  const existingSet = await Sets.findById(setId);
  if (!existingSet) {
    return res.status(400).json({
      message: 'Set does not exist'
    });
  }
  const existingGame = await Game.findById(gameId);
  if (!existingGame) {
    return res.status(400).json({
      message: 'Game does not exist'
    });
  }

  try {
    // Calculate the score
    const calculatedScore = await calculateScore(setId, gameId, winner);
    let scoreAfter;
    let finishGame = false;
    if (calculatedScore.message) {
      scoreAfter = calculatedScore.message;
      finishGame = true;
    } else {
      scoreAfter = calculatedScore;
    }
    // Create the point
    const newPoint = new Point({
      winner,
      cause,
      letPlayed,
      'scoreAfter': scoreAfter
    });
    const savedPoint = await newPoint.save();
    // Add the point to the game
    try {
      await Game.findByIdAndUpdate(gameId, { $push: { points: { id: savedPoint._id } } });
    } catch (error) {
      return res.status(500).json({
        message: 'Something went wrong, please try again'
      });
    }
    if (!finishGame) {
      res.status(200).json({ message: `Point ${savedPoint.scoreAfter} created!` });
    } else {
      res.json({ 'message': `${calculatedScore.message}`, newGameId: calculatedScore.newGameId });
    }
  } catch (error) {
    return res.status(400).json({
      message: 'something went wrong: ' + error.message
    });
  }
};

module.exports = addPoint;