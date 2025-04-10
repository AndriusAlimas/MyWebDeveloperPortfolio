const resumeList = document.querySelectorAll(".resume-list");
const resumeBoxs = document.querySelectorAll(".resume-box");
const progressLines = document.querySelectorAll(".progress-line span");
const skillTextSpans = document.querySelectorAll(
  ".technical-bars .bar .info span"
);

// Define skill levels in percentage
const skillLevels = {
  HTML: "100%",
  CSS: "80%",
  JavaScript: "90%",
  Python: "22%",
  React: "85%",
  Java: "60%",
};

const interpolateColor = (value) => {
  const red = Math.max(255 - value * 2.55, 0);
  const green = Math.min(value * 2.55, 255);
  return `rgb(${red}, ${green}, 0)`;
};

// Function to animate the percentage counter
const animateCounter = (element, targetValue) => {
  let currentValue = 0;
  const duration = 2000; // Total duration for the animation
  const increment = Math.ceil(targetValue / (duration / 100)); // Increment value

  const interval = setInterval(() => {
    currentValue += increment;
    if (currentValue > targetValue) {
      currentValue = targetValue; // Ensure it does not exceed the target value
    }
    element.textContent = currentValue + "%"; // Update the display
    if (currentValue === targetValue) {
      clearInterval(interval); // Stop the counter when the target is reached
    }
  }, 100); // Update every 100 ms
};

// Resume section functionality
resumeList.forEach((list, indx) => {
  list.addEventListener("click", () => {
    // Remove active class from current tab and add to clicked tab
    const activeList = document.querySelector(".resume-list.active");
    if (activeList) {
      activeList.classList.remove("active");
    }
    list.classList.add("active");

    // Hide current box and show the selected one
    const activeBox = document.querySelector(".resume-box.active");
    if (activeBox) {
      activeBox.classList.remove("active");
    }
    resumeBoxs[indx].classList.add("active");

    // Trigger animation for text and progress lines if the Skills tab is clicked
    if (list.textContent.trim() === "Skills") {
      // Reset and trigger text animation
      skillTextSpans.forEach((span) => {
        span.style.opacity = "0"; // Set opacity to 0 to reset animation
        span.style.animation = "none"; // Remove current animation

        // Force reflow
        span.offsetHeight;

        // Reapply animation
        span.style.animation = "showText 0.5s 0.5s linear forwards"; // Re-trigger animation
      });

      // Reset progress lines and animate
      progressLines.forEach((line) => {
        const skillName =
          line.parentElement.previousElementSibling.textContent.trim(); // Get skill name
        const targetValue = parseInt(skillLevels[skillName]); // Get skill percentage as integer
        const percentageDisplay = line.previousElementSibling; // Assuming it's the previous sibling

        // Reset the width and color initially
        line.style.width = "0%"; // Set to 0 for animation
        line.style.backgroundColor = "rgb(255, 0, 0)"; // Start from red

        // Force a reflow to ensure the browser recognizes the change
        line.offsetHeight;

        // Now set the animated properties
        line.style.transition = "width 2s ease, background-color 2s ease"; // Slow transitions
        line.style.width = skillLevels[skillName]; // Animate to skill level
        line.style.backgroundColor = interpolateColor(targetValue); // Set color based on skill level

        // Reset percentage display and start the counter animation
        percentageDisplay.textContent = "0%"; // Start at 0%
        animateCounter(percentageDisplay, targetValue); // Animate percentage from 0 to targetValue
      });
    } else {
      // Reset progress styles and text opacity when switching away from Skills
      skillTextSpans.forEach((span) => {
        span.style.opacity = "0"; // Reset opacity
        span.style.animation = "none"; // Remove the animation
      });

      progressLines.forEach((line) => {
        line.style.width = "0%"; // Reset to 0% when switching away
        line.style.transition = "none"; // Instant change to 0%

        const percentageDisplay = line.previousElementSibling; // Assuming percentage is the previous sibling
        percentageDisplay.textContent = "0%"; // Reset percentage display back to 0%
      });
    }
  });
});
