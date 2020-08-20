const Match = require('../models/matchModel');
const Game = require('../models/gamesModel');

/**
 * Start match by creating the teams and the first game and set without points
 */
const startMatch = async(req, res) => {
  let { team1, team2, serving } = req.body;

  // Validation
  if (!team1 || !team2 || !serving) {
    return res.status(400).json({
      message: 'Not all fields have been filled in'
    });
  }
  if (team1.length !== team2.length) {
    return res.status(400).json({
      message: 'This match seems unfair, please select an equal number of players on both sides'
    });
  }
  if (!team1.some(e => e.name === serving) && !team2.some(e => e.name === serving)) {
    return res.status(400).json({
      message: `Is the serving person not joining the match? Serving person: ${serving}, match players: ${team1[0].name}, ${team2}`
    });
  }

  const newGame = new Game({
    'number': 1,
    serving,
    'startTime': Date.now()
  });

  const savedGame = await newGame.save();

  const newSet = new Sets({
    games: [{
      'id': savedGame._id
    }]
  });
  const savedSet = await newSet.save();

  const newMatch = new Match({
    team1,
    team2,
    'date': {
      'startDate': Date.now(),
    },
    'sets': [{
      'id': savedSet._id
    }],
  });
  const savedMatch = await newMatch.save();
  res.json({ 'message': 'Match started!', 'matchId': savedMatch._id, 'setId': savedSet._id, 'gameId': savedGame._id });
};

module.exports = startMatch;