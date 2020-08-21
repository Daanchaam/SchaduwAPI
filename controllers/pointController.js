const Match = require('../models/matchModel');
const Sets = require('../models/setsModel');
const Game = require('../models/gamesModel');
const Point = require('../models/pointsModel');
const calculateScore = require('./scoreController');
/**
 * Add point to a game given the point structure and the ID of match and game
 */
const addPoint = async(req, res) => {
  let { winner, cause, letPlayed, matchId } = req.body;

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
  // Find the last set of the match
  const lastSet = await Sets.findById(existingMatch.sets[existingMatch.sets.length - 1].id);
  const lastGame = await Game.findById(lastSet.games[lastSet.games.length - 1].id);
  setId = lastSet._id;
  gameId = lastGame._id;
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
      res.json({ 'message': calculatedScore.message, 'score': calculatedScore.score });
    }
  } catch (error) {
    return res.status(400).json({
      message: 'something went wrong: ' + error.message
    });
  }
};

module.exports = addPoint;