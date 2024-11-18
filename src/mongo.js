const mongoose = require('mongoose');

// Define the schema for login collection
const loginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Ensure that each email is unique
  },
  password: {
    type: String,
    required: true
  },
  totalMarks: {
    type: Number, // Changed to Number from int
    required: true
  },
  passoutYear: {
    type: String,
    required: true
  },
  fatherName: {
    type: String,
    required: true
  },
});

// Create the model with the explicit collection name 'logincollections'
const LogInCollection = mongoose.model('LogInCollection', loginSchema, 'logincollections');

// Export the model
module.exports = LogInCollection;
