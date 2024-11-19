document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".select-btn");
  const hiddenInput = document.getElementById("selectedColleges");
  const submitBtn = document.getElementById("submit-btn");

  let selectedColleges = []; // Array to store selected college IDs

  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const collegeId = e.target.dataset.id;

      // Toggle selection
      if (selectedColleges.includes(collegeId)) {
        selectedColleges = selectedColleges.filter((id) => id !== collegeId);
        button.classList.remove("selected");
        button.innerText = "Select";
      } else {
        selectedColleges.push(collegeId);
        button.classList.add("selected");
        button.innerText = "Selected";
      }

      // Update hidden input value
      hiddenInput.value = JSON.stringify(selectedColleges);

      // Enable or disable submit button
      submitBtn.disabled = selectedColleges.length === 0;
    });
  });
});
