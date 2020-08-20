const startMatch = require('../controllers/matchController');
const addPoint = require('../controllers/pointController');

const router = require('express').Router();

router.post('/start', async(req, res) => {
  try {
    startMatch(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/addPoint', async(req, res) => {
  try {
    addPoint(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;