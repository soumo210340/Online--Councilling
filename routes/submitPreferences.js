const express = require('express');
const mongoose = require('mongoose');
const LogInCollection = require('../src/mongo'); // Adjust path as necessary
const performMatchmaking = require('../utils/matchmaking'); // Matchmaking logic


const router = express.Router(); // Initialize router

// Handle Preference Submission
router.post('/submit-preferences', async (req, res) => {
  const { userId, preferences } = req.body;

  // Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send('Invalid User ID');
  }

  try {
    const user = await LogInCollection.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Save selected college IDs
    user.selectedColleges = preferences.map((pref) => pref.collegeId);
    await user.save();

    // Perform matchmaking
    await performMatchmaking(userId, preferences);

    res.redirect(`/alloted-colleges?userId=${userId}`);
  } catch (error) {
    console.error('Error during preference submission:', error);
    res.status(500).send('Internal Server Error');
  }
});
res.status(500).json({ error: 'An internal error occurred while submitting preferences.' });

// Export the router
module.exports = router;
