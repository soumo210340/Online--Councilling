require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const LogInCollection = require('./mongo'); // Ensure correct path
const College = require('../models/colleges'); // Adjust path to College model
const performMatchmaking = require('../utils/matchmaking'); // Ensure correct path to matchmaking
const submitPreferencesRoutes = require('../routes/submitPreferences'); // Submit preferences route
const matchingRoutes = require('../routes/matching'); // Matching routes
const asyncHandler = require('express-async-handler'); // For error handling (optional)

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true })); // Form submissions
app.use(express.json()); // JSON data
app.use(express.static(path.join(__dirname, '..', 'public'))); // Serve static files from the 'public' folder

app.set('view engine', 'hbs'); // Set Handlebars as view engine
app.set('views', path.join(__dirname, '..', 'templates')); // Correct path to templates

// Routes
app.use('/api', submitPreferencesRoutes); // Ensure the route is properly prefixed
app.use(matchingRoutes); // Matching Routes

// Root Route
app.get('/', (req, res) => res.render('login')); // Ensure login.hbs is in templates folder

// Login Page
app.get('/login', (req, res) => res.render('login')); // Ensure login.hbs is in templates folder

// Handle Login
app.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { name, password } = req.body;

    const user = await LogInCollection.findOne({ name, password });
    if (!user) {
      return res.status(401).send('Login failed. Please check your credentials.');
    }

    res.redirect(`/home?userId=${user._id}`);
  })
);

// Signup Page
app.get('/signup', (req, res) => {
  res.render('signup'); // Ensure signup.hbs exists in the templates folder
});

// Handle Signup Form Submission
app.post(
  '/signup',
  asyncHandler(async (req, res) => {
    const { name, email,password,fatherName, passoutYear, totalMarks } = req.body;

    // Basic validation
    if (!name || !password || !email) {
      return res.status(400).send('All fields are required.');
    }

    // Check if the user already exists
    const existingUser = await LogInCollection.findOne({ email });
    if (existingUser) {
      return res.status(409).send('User with this email already exists.');
    }

    // Create a new user
    const newUser = new LogInCollection({
      name,
      password,
      email,
      fatherName,
      passoutYear,
      totalMarks,
    });

    await newUser.save();
    res.redirect('/login'); // Redirect to login page after successful signup
  })
);

// Render Home Page with Colleges
app.get(
  '/home',
  asyncHandler(async (req, res) => {
    const userId = req.query.userId;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send('Invalid User ID');
    }

    const user = await LogInCollection.findById(userId);
    const colleges = await College.find();

    if (!user) {
      return res.status(404).send('User not found');
    }
      
    res.render('home', { user, colleges });
  })
);

// Admin Add College Form (GET)
app.get('/admin/add-college', (req, res) => {
  res.render('add-college'); // Render add-college.hbs
});

// Admin Add College Form (POST)
app.post(
  '/admin/add-college',
  asyncHandler(async (req, res) => {
    const { name, location, courses, establishedYear, marksRange, capacity } = req.body;

    const newCollege = new College({
      name,
      location,
      courses,
      establishedYear,
      marksRange,
      capacity,
    });

    await newCollege.save();
    res.redirect('/admin/add-college');
  })
);

// Handle Preference Submission
app.post('/submit-preferences', asyncHandler(async (req, res) => {
  const { userId, preferences } = req.body;
  console.log("Received User ID: ", userId); // Log received userId
  console.log("Received Preferences: ", preferences); // Log preferences data

  // Check if preferences is an array and has the expected format
  if (!Array.isArray(preferences) || preferences.some(pref => !pref.collegeId)) {
    return res.status(400).json({ error: 'Preferences should be an array of objects with a valid collegeId' });
  }

  // Check if userId is valid
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.error("Invalid User ID: ", userId); // Log invalid userId
    return res.status(400).json({ error: 'Invalid User ID. Please check the ID and try again.' });
  }

  const user = await LogInCollection.findById(userId);

  if (!user) {
    console.error("User not found: ", userId); // Log when user is not found
    return res.status(404).json({ error: 'User not found. Please ensure you are logged in.' });
  }

  // Save preferences
  try {
    user.selectedColleges = preferences.map((pref) => pref.collegeId); // Update user with selected colleges
    await user.save();  // Save the user's updated college preferences

    // Perform matchmaking
    await performMatchmaking(userId, preferences);

    console.log("User preferences updated successfully"); // Log success
    res.status(200).json({ message: "Preferences submitted successfully. Thank you!" });  // Send success message
  } catch (error) {
    console.error("Error saving preferences: ", error); // Log any errors during preference saving
    res.status(500).json({ error: "An error occurred while saving your preferences. Please try again later." });
  }
}));

// Render Allotted Colleges Page
app.get(
  '/alloted-colleges',
  asyncHandler(async (req, res) => {
    const { userId } = req.query;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send('Invalid User ID');
    }

    const user = await LogInCollection.findById(userId).populate('selectedColleges');

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.render('allotedColleges', { user, allottedColleges: user.selectedColleges });
  })
);

// Success Route
app.get('/success', (req, res) => {
  res.render('success'); // Render success.hbs
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
