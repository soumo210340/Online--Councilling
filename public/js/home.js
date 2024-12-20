document.addEventListener("DOMContentLoaded", () => {
  const userIdInput = document.getElementById("userId");
  const userId = userIdInput ? userIdInput.value : null;

  if (!userId) {
    console.error("User ID not found");
    alert("User ID is missing. Please log in again.");
    return;
  }

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

    // Ensure selectedColleges is populated before sending the data
    if (selectedColleges.length === 0) {
      alert("Please select at least one college.");
      return;
    }

    // Format the selected colleges into the expected format (array of objects with collegeId)
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

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        window.location.href = "/success"; // Redirect to success page after submission
      } else {
        alert(result.error || "Failed to submit preferences.");
      }
    } catch (error) {
      console.error("Error submitting preferences:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  });
});
