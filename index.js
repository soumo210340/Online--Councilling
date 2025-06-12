require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const LogInCollection = require('./src/mongo'); // Ensure correct path
const College = require('./models/colleges'); // Adjust path to College model
const performMatchmaking = require('./utils/matchmaking'); // Ensure correct path to matchmaking
const submitPreferencesRoutes = require('./routes/submitPreferences'); // Submit preferences route
const matchingRoutes = require('./routes/matching'); // Matching routes
const asyncHandler = require('express-async-handler'); // For error handling (optional)
const signupRoute = require('./routes/signup');
const hbs = require('hbs'); // Require hbs

// Register a Handlebars helper to stringify JSON
hbs.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

// Initialize Express
const app = express();
const port = process.env.PORT || 3001; // Changed port back to 3001

// Middleware
app.use(express.urlencoded({ extended: true })); // Form submissions
app.use(express.json()); // JSON data
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' folder
app.set('view engine', 'hbs'); // Ensure Handlebars is used as the view engine
app.set('views', path.join(__dirname, 'templates')); // Correct path to templates

// Routes
app.use('/signup', signupRoute); // singup page 
// app.use(submitPreferencesRoutes); // Temporarily commented out to use the inline route below
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

    // Debugging log
    console.log("Received User ID in /home route:", userId);

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
    res.redirect('/admin');
  })
);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
