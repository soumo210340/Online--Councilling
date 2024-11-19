const mongoose = require('mongoose');

// Create models



// Define the schema for login collection
const loginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  totalMarks: {
    type: Number,
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


const LogInCollection = mongoose.model('LogInCollection', loginSchema, 'logincollections');


// Export models
module.exports =  LogInCollection ;
