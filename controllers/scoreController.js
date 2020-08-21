const Game = require('../models/gamesModel');
const Point = require('../models/pointsModel');
const finishGame = require('./gameController');

const calculateScore = async(setId, gameId, winner) => {
  const game = await Game.findById(gameId);
  var playedPoints = game.points.map(function(x) { return x.id; });
  const points = await Point.find({ _id: { $in: playedPoints } });

  // No points have been played
  if (points.length < 1) {
    return winner === 1 ? '15-0' : '0-15';
  }
  return addScoreForTeam(winner, points, gameId, setId);
};

/**
 * Adds score for the team given
 * @param {Number} team the team to win the point
 * @param {Point} points the list of points already played
 */
const addScoreForTeam = (team, points, gameId, setId) => {
  let pointToIncrement = points[points.length - 1].scoreAfter;
  if (team === 1) {
    if (pointToIncrement === '15-0') {
      return '30-0';
    } else if (pointToIncrement === '30-0') {
      return '40-0';
    } else if (pointToIncrement === '40-0') {
      return finishGame(1, gameId, setId);
    } else if (pointToIncrement === '0-15') {
      return '15-15';
    } else if (pointToIncrement === '0-30') {
      return '15-30';
    } else if (pointToIncrement === '0-40') {
      return '15-40';
    } else if (pointToIncrement === '15-15') {
      return '30-15';
    } else if (pointToIncrement === '30-15') {
      return '40-15';
    } else if (pointToIncrement === '40-15') {
      finishGame(1, gameId, setId);
      return 'game team 1';
    } else if (pointToIncrement === '15-30') {
      return '30-30';
    } else if (pointToIncrement === '30-30') {
      return '40-30';
    } else if (pointToIncrement === '40-30') {
      finishGame(1, gameId, setId);
      return 'game team 1';
    } else if (pointToIncrement === '15-40') {
      return '30-40';
    } else if (pointToIncrement === '30-40') {
      return '40-40';
    } else if (pointToIncrement === '40-40') {
      return 'adv-40';
    } else if (pointToIncrement === 'adv-40') {
      finishGame(1, gameId, setId);
      return 'game team 1';
    } else if (pointToIncrement === '40-adv') {
      return '40-40';
    } else {
      throw new Error('Game already finished!');
    }
  } else if (team === 2) {
    if (pointToIncrement === '15-0') {
      return '15-15';
    } else if (pointToIncrement === '30-0') {
      return '30-15';
    } else if (pointToIncrement === '40-0') {
      return '40-15';
    } else if (pointToIncrement === '0-15') {
      return '0-30';
    } else if (pointToIncrement === '0-30') {
      return '0-40';
    } else if (pointToIncrement === '0-40') {
      finishGame(2, gameId, setId);
      return 'game team 2';
    } else if (pointToIncrement === '15-15') {
      return '15-30';
    } else if (pointToIncrement === '30-15') {
      return '30-30';
    } else if (pointToIncrement === '30-30') {
      return '30-40';
    } else if (pointToIncrement === '40-15') {
      return '40-30';
    } else if (pointToIncrement === '15-30') {
      return '15-40';
    } else if (pointToIncrement === '15-40') {
      finishGame(2, gameId, setId);
      return 'game team 2';
    } else if (pointToIncrement === '30-40') {
      finishGame(2, gameId, setId);
      return 'game team 2';
    } else if (pointToIncrement === '40-30') {
      return '40-40';
    } else if (pointToIncrement === '40-40') {
      return '40-adv';
    } else if (pointToIncrement === 'adv-40') {
      return '40-40';
    } else if (pointToIncrement === '40-adv') {
      finishGame(2, gameId, setId);
      return 'game team 2';
    } else {
      throw new Error('Game already finished!');
    }
  }
};

module.exports = calculateScore;