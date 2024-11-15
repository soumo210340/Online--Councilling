const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const LogInCollection = require('./mongo');
const addCollegeRoutes = require('./addcollege');
const matchingRoutes = require('./routes/matching'); // Import matching route

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

// Existing routes
app.get('/login', (req, res) => {
  res.render('login');
});

// Other routes...

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
