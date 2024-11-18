const StudentChoice = require('../models/studentChoice');
const CollegeCollection = require('../models/college');

async function galeShapleyMatchmaking() {
  const students = await StudentChoice.find({}).populate('studentId');
  const colleges = await CollegeCollection.find({});

  const studentPreferences = {};
  const collegeSeats = {};
  const collegePreferences = {};

  // Prepare data for Gale-Shapley
  students.forEach(student => {
    studentPreferences[student.studentId._id] = student.choices.map(choice => choice.collegeId);
  });

  colleges.forEach(college => {
    collegeSeats[college._id] = college.seats || 5; // Default 5 seats
    collegePreferences[college._id] = students.map(student => student.studentId._id);
  });

  // Gale-Shapley Algorithm Implementation
  const matches = {};
  const freeStudents = Object.keys(studentPreferences);

  while (freeStudents.length) {
    const studentId = freeStudents.shift();
    const studentPrefs = studentPreferences[studentId];

    for (const collegeId of studentPrefs) {
      if (!matches[collegeId]) matches[collegeId] = [];
      if (matches[collegeId].length < collegeSeats[collegeId]) {
        matches[collegeId].push(studentId);
        break;
      } else {
        const worstStudent = matches[collegeId].pop(); // Pop the least preferred
        if (collegePreferences[collegeId].indexOf(studentId) <
            collegePreferences[collegeId].indexOf(worstStudent)) {
          matches[collegeId].push(studentId);
          freeStudents.push(worstStudent);
          break;
        } else {
          matches[collegeId].push(worstStudent); // Keep the previous student
        }
      }
    }
  }

  console.log('Final Matches:', matches);
  return matches;
}

module.exports = galeShapleyMatchmaking;
