document.addEventListener("DOMContentLoaded", () => {
  const selectButtons = document.querySelectorAll(".select-btn");
  const selectedCollegesInput = document.getElementById("selectedColleges");
  const submitButton = document.getElementById("submit-btn");

  let selectedColleges = [];

  // Handle select button clicks
  selectButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const collegeId = button.getAttribute("data-id");

      // Toggle selection state
      if (selectedColleges.includes(collegeId)) {
        selectedColleges = selectedColleges.filter((id) => id !== collegeId);
        button.textContent = "Select";
        button.classList.remove("selected");
      } else {
        selectedColleges.push(collegeId);
        button.textContent = "Deselect";
        button.classList.add("selected");
      }

      // Update hidden input value
      selectedCollegesInput.value = JSON.stringify(selectedColleges);

      // Enable or disable submit button
      submitButton.disabled = selectedColleges.length === 0;
    });
  });

  // Handle form submission
  const form = document.getElementById("preferencesForm");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const userId = form.querySelector("input[name='userId']").value;
    console.log("User ID: ", userId);  // Log userId

    // Format the selectedColleges into an array of objects with collegeId
    const formattedSelectedColleges = selectedColleges.map(collegeId => ({
      collegeId: collegeId  // each element will be an object with 'collegeId'
    }));

    console.log("Formatted Preferences: ", formattedSelectedColleges);  // Log preferences

    try {
      const response = await fetch("/student/submit-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          preferences: formattedSelectedColleges,  // Send preferences as an array of objects
        }),
      });

      const result = await response.json();
      console.log("Response from server: ", result);  // Log server response

      if (response.ok) {
        alert(result.message);
        window.location.href = "/"; // Redirect to home or another page
      } else {
        console.error("Response Error:", result);
        alert(`Error: ${result.error || "Failed to submit preferences. Please try again."}`);
      }
    } catch (error) {
      console.error("Error submitting preferences:", error);
      alert(`Error: ${error.message || "There was an issue with your submission. Please try again."}`);
    }
  });
});
