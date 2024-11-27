const mongoose = require('mongoose');

// Define the schema for the College model
const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  courses: {
    type: [String],
    required: true,
  },
  establishedYear: {
    type: Number,
    required: true,
  },
  minMarks: {
    type: Number,
    required: true,
  },
  maxMarks: {
    type: Number,
    required: true,
  },
  capacity: { type: Number,
   required: true }
});

// Check if the model already exists to prevent overwriting
let College;
if (mongoose.models.College) {
  College = mongoose.model('College');
} else {
  College = mongoose.model('College', collegeSchema);
}

module.exports = College;
