const express = require('express');
const router = express.Router();
const galeShapleyMatchmaking = require('../utils/matchmaking');

const Student = require('../models/Student'); // adjust path as needed\\


router.get('/AllotedColleges', async (req, res) => {
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

// colleges display korbe 

router.get('/allottedcolleges', async (req, res) => {
  try {
    const students = await Student.find().populate('allottedCollege'); // assuming this field exists
    res.render('allotedColleges', { students });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;

// routes/viewAllotedCollege.js [ suceess page r jonno ]

router.get("/success", async (req, res) => {
  try {
    const userId = req.query.userId; // Get userId from query string (e.g., /success?userId=123)
    const student = await Student.findById(userId).populate("selectedColleges");

    if (!student) {
      return res.status(404).send("Student not found");
    }

    res.render("success", {
      user: student,
      selectedColleges: student.selectedColleges,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
