const express = require('express');
const router = express.Router();
const galeShapleyMatchmaking = require('../utils/matchmaking');

router.get('/viewAllotedCollege', async (req, res) => {
  try {
    const matches = await galeShapleyMatchmaking();
    const studentId = req.query.studentId; // Pass logged-in student ID
    const allotedColleges = Object.keys(matches).filter(collegeId =>
      matches[collegeId].includes(studentId)
    );

    res.render('allotedColleges', { allotedColleges });
  } catch (err) {
    console.error('Error fetching allotted colleges:', err);
    res.status(500).send('Error fetching allotted colleges.');
  }
});

module.exports = router;
