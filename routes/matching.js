const express = require('express');
const galeShapleyMatching = require('../utils/matchmaking');
const router = express.Router();

router.get('/matchmaking', async (req, res) => {
  try {
    const matches = await galeShapleyMatching();
    res.render('matches', { matches });
  } catch (error) {
    res.status(500).send('Error executing matchmaking algorithm');
  }
});

module.exports = router;
