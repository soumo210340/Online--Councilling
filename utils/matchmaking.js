// matchmaking.js
const LogInCollection = require('../src/mongo'); // Adjust path as needed
const College = require('../models/colleges'); // Adjust path as needed

// Example of Gale-Shapley algorithm for stable matching
async function performMatchmaking() {
  // Get the list of colleges and students
  const colleges = await College.find();
  const students = await LogInCollection.find();

  // Implement the Gale-Shapley algorithm for matchmaking
  // This is a simplified version; adapt as per your needs
  colleges.forEach(college => {
    let availableStudents = students.filter(student => student.selectedColleges.includes(college._id));

    // Example matching logic (this is just a placeholder, adjust to your needs)
    availableStudents.sort((a, b) => b.totalMarks - a.totalMarks);  // Sort by marks

    // Assign students to colleges (simplified)
    college.matchedStudents = availableStudents.slice(0, college.capacity); // Assuming college has a 'capacity' field

    college.save();

    if (selectedColleges && Array.isArray(selectedColleges)) {
      selectedColleges.includes(college._id);
  } else {
      console.error("selectedColleges is undefined or not an array.");
  }
  
  });
  console.log("Preferences received:", preferences);
console.log("Selected Colleges:", selectedColleges);

}

module.exports = performMatchmaking;
