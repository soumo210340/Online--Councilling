const mongoose = require('mongoose');
const { Schema } = mongoose;

// Sub-schema for matched students
const matchedStudentSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: 'LogInCollection', required: true },
  name: { type: String, required: true }
}, { _id: false }); // _id: false for subdocuments if you don't want an additional _id for the subdocument itself

// Define the schema for College
const collegeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  location: { // Added location
    type: String,
    required: false // Or true, depending on your needs
  },
  courses: {
    type: [String],
    required: true
  },
  establishedYear: { // Added establishedYear
    type: Number,
    required: false // Or true, depending on your needs
  },
  marksRange: {
    type: String,
    required: true
  },
  capacity: { 
    type: Number,
    required: true
  },
  matchedStudents: [matchedStudentSchema] // Use the sub-schema here
});

// Create and export the model
module.exports = mongoose.model('College', collegeSchema);