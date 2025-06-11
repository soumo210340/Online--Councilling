const mongoose = require('mongoose');

// Destructure Schema from mongoose
const { Schema } = mongoose;

// Define the schema for login collection
const loginSchema = new Schema({
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
    required: false
  },
  selectedColleges: [
    {
      college: { type: Schema.Types.ObjectId, ref: 'College', required: true },
      priority: { type: Number, required: true, min: 1 }
    }
  ]
});

// Define the model
const LogInCollection = mongoose.model('LogInCollection', loginSchema, 'logincollections');

// Export the model
module.exports = LogInCollection;
