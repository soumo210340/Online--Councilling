const mongoose = require("mongoose");

// Define the student schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  passoutYear: { type: Number, required: true },
  fatherName: { type: String, required: true },
  preferences: { type: [String], default: [] }, // Array of college IDs
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
