document.addEventListener("DOMContentLoaded", () => {
  const selectButtons = document.querySelectorAll(".select-btn");
  const selectedCollegesInput = document.getElementById("selectedColleges");
  const submitButton = document.getElementById("submit-btn");
  
  let selectedColleges = [];

  // Handle select button clicks
  selectButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const collegeId = button.getAttribute("data-id");

      if (selectedColleges.includes(collegeId)) {
        selectedColleges = selectedColleges.filter((id) => id !== collegeId);
        button.textContent = "Select";
        button.classList.remove("selected");
      } else {
        selectedColleges.push(collegeId);
        button.textContent = "Deselect";
        button.classList.add("selected");
      }

      selectedCollegesInput.value = JSON.stringify(selectedColleges);
      submitButton.disabled = selectedColleges.length === 0;
    });
  });

  // Handle form submission via Fetch API
  const form = document.getElementById("preferencesForm");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const userId = form.querySelector("input[name='userId']").value;

    // Ensure selectedColleges is in the correct format for backend (array of objects)
    const formattedSelectedColleges = selectedColleges.map(collegeId => ({
      collegeId: collegeId
    }));

    try {
      const response = await fetch("/submit-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          preferences: formattedSelectedColleges,  // Send preferences as an array of objects
        }),
      });

      // Check if the response is valid JSON
      const result = await response.text(); // Use text() to inspect the raw response
      console.log("Raw server response:", result);

      try {
        const parsedResult = JSON.parse(result); // Parse the response if it's valid JSON
        if (response.ok) {
          alert(parsedResult.message);
          window.location.href = "/"; // Redirect to home or another page
        } else {
          alert(parsedResult.error || "Failed to submit preferences.");
        }
      } catch (error) {
        console.error("Error parsing server response:", error);
        alert("The server response is not valid JSON.");
      }

    } catch (error) {
      console.error("Error submitting preferences:", error);
      alert("An unexpected error occurred.");
      
      // In case of an error, log the raw response body from the server
      const errorText = await response.text();
      console.log("Server Error Details: ", errorText);
    }
  });
});
