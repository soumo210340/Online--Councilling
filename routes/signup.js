// routes/signup.js
const express = require('express');
const router = express.Router();
const LogInCollection = require('../src/mongo'); // Make sure this exports the Mongoose model

// GET signup page
router.get('/', (req, res) => {
  res.render('signup'); // Render signup.hbs from templates
});

// POST signup form
router.post('/', async (req, res) => {
  const { name, email, password, totalMarks, passoutYear, fatherName } = req.body;

  try {
    // Check if user already exists
    const existingUser = await LogInCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    // Create new user (pass data, not schema definition)
    const newUser = new LogInCollection({
      name,
      email,
      password,
      totalMarks,
      passoutYear,
      fatherName // Optional
    });

    await newUser.save();

    res.redirect('/login');
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).send('Something went wrong');
  }
});

module.exports = router;
