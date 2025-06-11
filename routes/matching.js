const express = require('express');
const galeShapleyMatching = require('../utils/matchmaking');
const Student = require('../models/Student'); // Ensure this points to your student model

const router = express.Router();

/*
router.get('/matchmaking', async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).send('User not logged in');
    }

    // Validate user and preferences
    const student = await Student.findById(userId).populate('preferences.collegeId');

    if (!student || !Array.isArray(student.preferences)) {
      throw new Error("Invalid preferences format.");
    }

    // Run the matchmaking algorithm (across all students)
    const matches = await galeShapleyMatching(userId); // Only pass userId, logic will handle all

    // Render match result
    res.render('matches', { matches });
  } catch (error) {
    console.error("Error in performMatchmaking:", error.message);
    res.status(500).send('Error executing matchmaking algorithm');
  }
});
*/

module.exports = router;
