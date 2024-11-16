const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const LogInCollection = require('./mongo').default; // Make sure this path is correct
const addCollegeRoutes = require('./addcollege');
const matchingRoutes = require('../routes/matching'); // Import matching route

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Set up handlebars
app.set('views', path.join(__dirname, '../templates'));
app.set('view engine', 'hbs');

// Register routes
app.use(addCollegeRoutes);
app.use(matchingRoutes); // Register matching route

// Render login page
app.get('/login', (req, res) => {
  res.render('login');
});

// Handle login form submission
app.post('/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await LogInCollection.findOne({ name, password });
    if (user) {
      res.redirect(`/home?userId=${user._id}`);
    } else {
      res.status(401).send('Login failed. Please check your credentials.');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
