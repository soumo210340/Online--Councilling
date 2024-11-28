const LogInCollection = require('../src/mongo'); // Adjust path as needed
const College = require('../models/colleges'); // Adjust path as needed

// Example of Gale-Shapley algorithm for stable matching
async function performMatchmaking(userId, preferences) {
  try {
    // Validate inputs
    if (!Array.isArray(preferences)) {
      throw new Error('Invalid preferences format.');
    }

    // Fetch all colleges and students
    const colleges = await College.find();
    const students = await LogInCollection.find();

    // Filter student based on the specific user
    const currentUser = students.find(student => student._id.toString() === userId);
    if (!currentUser) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    const selectedColleges = currentUser.selectedColleges;

    if (!Array.isArray(selectedColleges)) {
      console.error("selectedColleges is undefined or not an array.");
      return;
    }

    // Implement matchmaking logic
    colleges.forEach(college => {
      let availableStudents = students.filter(student =>
        Array.isArray(student.selectedColleges) && student.selectedColleges.includes(college._id.toString())
      );

      // Example matching logic: Sort by marks
      availableStudents.sort((a, b) => b.totalMarks - a.totalMarks); // Assuming `totalMarks` exists

      // Assign students to college
      college.matchedStudents = availableStudents.slice(0, college.capacity || 0); // Assuming `capacity` exists
      college.save();
    });

    console.log("Matchmaking completed successfully.");
  } catch (error) {
    console.error("Error in performMatchmaking:", error);
    throw error; // Ensure the error bubbles up
  }
}

module.exports = performMatchmaking;
