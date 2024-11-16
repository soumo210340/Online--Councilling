const express = require('express');
const router = express.Router();
const LogInCollection = require('../src/mongo').default;

router.post('/login', async (req, res) => {
  const { name, password } = req.body;
  const user = await LogInCollection.findOne({ name, password });

  if (user) {
    res.redirect(`/home?userId=${user._id}`);
  } else {
    res.send('Login failed. Please check your credentials.');
  }
});

module.exports = router;
