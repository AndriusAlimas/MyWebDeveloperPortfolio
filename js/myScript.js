// Selectors
const resumeItems = document.querySelectorAll(".resume-list");
const resumeDetails = document.querySelectorAll(".resume-box");
const skillTextSpans = document.querySelectorAll(
  ".technical-bars .bar .info span"
);
const iconElements = document.querySelectorAll(".icon");
const skillProgressRings = document.querySelectorAll(".progress-ring");

// Skill levels
const skillLevels = {
  HTML: 100,
  CSS: 80,
  JavaScript: 90,
  Python: 22,
  React: 85,
  Java: 60,
};

// Variables
let currentAnimationFrame;
let animationInProgress = false;

// Resume section handling
resumeItems.forEach((item, index) => {
  item.addEventListener("click", () => handleResumeClick(index, item));
});

function handleResumeClick(index, listElement) {
  if (animationInProgress) return; // Prevent switching if animation is in progress

  setActiveClass(resumeItems, listElement);
  setActiveClass(resumeDetails, resumeDetails[index]);
  resetAllIconsAndProgress();

  if (listElement.textContent.trim() === "Skills") {
    triggerTextAnimation(skillTextSpans);
  } else {
    resetTextAnimation(skillTextSpans);
  }
}

function setActiveClass(elements, activeElement) {
  elements.forEach((item) => item.classList.remove("active"));
  activeElement.classList.add("active");
}

function triggerTextAnimation(elements) {
  elements.forEach((span) => {
    span.style.opacity = "0";
    span.style.animation = "none";
    span.offsetHeight; // Force reflow
    span.style.animation = "showText 0.5s 0.5s linear forwards";
  });
}

function resetTextAnimation(elements) {
  elements.forEach((span) => {
    span.style.opacity = "0";
    span.style.animation = "none";
  });
}

// Skill progress animations
iconElements.forEach((icon) => {
  icon.addEventListener("click", () => {
    if (!animationInProgress) {
      resetAllIconsAndProgress(); // Reset before starting a new animation
      handleIconClick(icon);
    }
  });
});

function handleIconClick(icon) {
  const skill = icon.getAttribute("data-skill");
  const targetValue = skillLevels[skill]; // Get the target percentage directly

  setActiveClass(iconElements, icon); // Set active class on the clicked icon

  // Show the progress ring related to the clicked icon
  const progressRing = icon.querySelector(".progress-ring");
  progressRing.style.display = "block"; // Show progress ring
  const progressCircle = progressRing.querySelector(".progress-ring__circle");
  const percentageTextDiv = icon.querySelector(".percentage"); // Get the percentage text div

  animationInProgress = true; // Lock interactions while animation is in progress
  percentageTextDiv.textContent = "0%"; // Reset initial percentage text
  percentageTextDiv.style.display = "block"; // Show the percentage div
  animateSkillProgress(progressCircle, targetValue, percentageTextDiv); // Start the animation
}

function animateSkillProgress(circle, targetValue, percentageTextDiv) {
  const radius = circle.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = circumference; // Start offset

  const duration = 2000; // Total duration for the animation
  const startTime = performance.now();

  function animate() {
    const currentTime = performance.now();
    const progress = Math.min((currentTime - startTime) / duration, 1); // Normalize progress from 0 to 1
    const offset =
      circumference - ((progress * targetValue) / 100) * circumference; // Adjust for percentage
    circle.style.strokeDashoffset = offset;

    // Update stroke color based on progress
    const color = interpolateColor(progress * 100, [255, 0, 0], [0, 255, 0]); // Interpolate color from red to green
    circle.style.stroke = color;

    // Calculate and update the percentage text during animation
    const interimPercentage = Math.round(progress * targetValue); // Calculate interim percentage
    percentageTextDiv.textContent = `${interimPercentage}%`; // Update the text content

    if (progress < 1) {
      currentAnimationFrame = requestAnimationFrame(animate); // Continue animation
    } else {
      animationInProgress = false; // Unlock interactions after animation finishes
    }
  }

  animate(); // Start the animation
}

function interpolateColor(progress, startColor, endColor) {
  return (
    startColor
      .map((start, i) =>
        Math.round(start + (endColor[i] - start) * (progress / 100))
      )
      .reduce((accum, color) => `${accum}${color},`, "rgb(")
      .slice(0, -1) + ")"
  );
}

function cancelOngoingAnimations() {
  if (currentAnimationFrame) {
    cancelAnimationFrame(currentAnimationFrame);
  }
}

function resetAllIconsAndProgress() {
  cancelOngoingAnimations();
  animationInProgress = false; // Ensure flag is reset

  // Reset icons and progress rings
  iconElements.forEach((icon) => {
    icon.classList.remove("active");
    icon.style.display = "block"; // Ensure hidden icons are visible again
    const progressRing = icon.querySelector(".progress-ring");
    if (progressRing) {
      progressRing.style.display = "none"; // Hide progress ring when resetting
      const circle = progressRing.querySelector(".progress-ring__circle");
      circle.style.strokeDashoffset = circle.r.baseVal.value * 2 * Math.PI; // Reset to start position
      circle.style.stroke = `rgb(255, 0, 0)`; // Reset to start color
    }

    // Reset percentage display
    const percentageTextDiv = icon.querySelector(".percentage");
    if (percentageTextDiv) {
      percentageTextDiv.textContent = "0%"; // Reset text
      percentageTextDiv.style.display = "none"; // Hide percentage text
    }
  });
}
