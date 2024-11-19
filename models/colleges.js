const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  courses: { type: String, required: true },
  establishedYear: { type: Number, required: true },
  marksRange: { type: String, required: true }
});

module.exports = mongoose.model('College', collegeSchema);
