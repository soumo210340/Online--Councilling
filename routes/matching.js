const express = require('express');
const galeShapleyMatch = require('../utils/matchmaker');

const router = express.Router();

router.get('/match', async (req, res) => {
  try {
    const matches = await galeShapleyMatch();
    res.json(matches); // Send matches as JSON response
  } catch (error) {
    console.error('Error running Gale-Shapley:', error);
    res.status(500).send('Error during matching');
  }
});

module.exports = router;
