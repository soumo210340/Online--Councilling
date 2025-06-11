document.addEventListener("DOMContentLoaded", () => {
  const userIdInput = document.querySelector("input[name='userId']"); // Correctly select by name
  const userId = userIdInput ? userIdInput.value : null;

  if (!userId) {
    console.error("User ID not found");
    alert("User ID is missing. Please log in again.");
    return;
  }

  // Log userId for debugging
  console.log("User ID in form:", userId);

  // Parse colleges data from embedded JSON
  const collegesDataElement = document.getElementById("collegesData");
  const colleges = collegesDataElement ? JSON.parse(collegesDataElement.textContent) : [];

  const selectButtons = document.querySelectorAll(".select-btn");
  const submitButton = document.getElementById("submit-btn");
  let selectedColleges = [];

  // Handle select/deselect of colleges
  selectButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const collegeId = button.getAttribute("data-id");
      const priorityInput = document.querySelector(`input[name='preferences[${collegeId}]']`);

      if (selectedColleges.includes(collegeId)) {
        selectedColleges = selectedColleges.filter((id) => id !== collegeId);
        button.textContent = "Select";
        button.classList.remove("selected");
        if (priorityInput) {
          priorityInput.disabled = true; // Disable priority input
          priorityInput.value = ""; // Clear priority value
        }
      } else {
        selectedColleges.push(collegeId);
        button.textContent = "Deselect";
        button.classList.add("selected");
        if (priorityInput) {
          priorityInput.disabled = false; // Enable priority input
        }
      }

      // Enable or disable the submit button based on selection
      submitButton.disabled = selectedColleges.length === 0;
    });
  });

  // Initially disable all priority inputs
  document.querySelectorAll("input[name^='preferences']").forEach((input) => {
    input.disabled = true;
  });

  // Handle form submission
  const form = document.getElementById("preferencesForm");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (selectedColleges.length === 0) {
      alert("Please select at least one college.");
      return;
    }

    console.log('--- Preparing to validate preferences ---');
    const formattedPreferences = selectedColleges.map(collegeId => {
      const priorityInput = document.querySelector(`input[name='preferences[${collegeId}]']`);
      const rawValue = priorityInput ? priorityInput.value : 'Input not found';
      const priority = priorityInput && priorityInput.value.trim() !== '' ? parseInt(priorityInput.value, 10) : null;
      
      console.log(`College ID: ${collegeId}, Raw Priority Value: "${rawValue}", Parsed Priority: ${priority}`);
      return { collegeId, priority };
    });
    console.log('--- Finished formatting preferences for validation ---');

    // Check if any priority is invalid for selected colleges
    const invalidPreference = formattedPreferences.find(p => p.priority === null || isNaN(p.priority) || p.priority <= 0);
    if (invalidPreference) {
      // Find the specific college name for a more detailed error message
      const collegeDetail = colleges.find(c => c._id === invalidPreference.collegeId);
      const collegeName = collegeDetail ? collegeDetail.name : `College ID ${invalidPreference.collegeId}`;
      alert(`Invalid priority for ${collegeName}. Ensure all selected colleges have a valid, positive priority number entered.`);
      return;
    }

    // Log userId for debugging
    console.log("User ID in form submission:", userId);

    try {
      const response = await fetch("/submit-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          preferences: formattedPreferences
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Preferences submitted successfully!");
        window.location.href = `/success?userId=${userId}`;

      } else {
        alert(result.error || "Failed to submit preferences.");
      }
    } catch (error) {
      console.error("Error submitting preferences:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  });
});
