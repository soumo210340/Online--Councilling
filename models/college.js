const mongoose = require('mongoose');

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
    required: true,}
});

const College = mongoose.model('college', collegeSchema);

module.exports = College;
