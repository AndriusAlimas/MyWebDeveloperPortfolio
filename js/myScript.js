const resumeItems = document.querySelectorAll(".resume-list");
const resumeDetails = document.querySelectorAll(".resume-box");
const portfolioList = document.querySelectorAll(".portfolio-list");
const portfolioBoxs = document.querySelectorAll(".portfolio-box");
const skillTextSpans = document.querySelectorAll(
  ".technical-bars .bar .info span"
);
const iconElements = document.querySelectorAll(".icon");
const skillProgressRings = document.querySelectorAll(".progress-ring");
const navs = document.querySelectorAll(".nav-list li");
const cube = document.querySelector(".box");
const sections = document.querySelectorAll(".section");
const start = true;

// Create iconData dynamically based on iconElements
const iconData = Array.from(iconElements).map((element, index) => ({
  order: index + 1,
  element: element,
  active: false,
}));

// Skill levels
const skillLevels = {
  HTML: 100,
  CSS: 80,
  JavaScript: 90,
  Python: 22,
  React: 75,
  Java: 60,
  Bootstrap: 70,
  Git: 80,
  jQuery: 82,
  node_js: 72,
  php: 30,
  mysql: 33,
  netlify: 50,
};

let currentAnimationFrame;
let animationInProgress = false;
let currentIconIndex = 0;
let activeIconIndex = null;

navs.forEach((nav, index) => {
  nav.addEventListener("click", () => {
    document.querySelector(".nav-list li.active").classList.remove("active");
    nav.classList.add("active");

    cube.style.transform = `rotateY(${index * -90}deg)`;
    document.querySelector(".section.active").classList.remove("active");
    sections[index].classList.add("active");

    const array = Array.from(sections);
    const arrSecs = array.slice(1, -1); // only requires indexses 1,2,3 or does not require start and end indexses

    arrSecs.forEach((arrSec) => {
      if (arrSec.classList.contains("active")) {
        sections[4].classList.add("action-contact");
      }
    });
    if (sections[0].classList.contains("active")) {
      sections[4].classList.remove("action-contact");
    }
  });
});

// Resume section handling
resumeItems.forEach((item, index) => {
  item.addEventListener("click", () => handleResumeClick(index, item));
});

function handleResumeClick(index, listElement) {
  if (animationInProgress) return; // Prevent switching if animation is in progress

  setActiveClass(resumeItems, listElement);
  setActiveClass(resumeDetails, resumeDetails[index]);
  resetAllIconsAndProgress();
}

portfolioList.forEach((list, index) => {
  list.addEventListener("click", () => {
    document.querySelector(".portfolio-list.active").classList.remove("active");
    list.classList.add("active");

    document.querySelector(".portfolio-box.active").classList.remove("active");
    portfolioBoxs[index].classList.add("active");
  });
});

function setActiveClass(elements, activeElement) {
  elements.forEach((item) => item.classList.remove("active"));
  activeElement.classList.add("active");
}

// Skill progress animations
iconElements.forEach((icon, index) => {
  const description = icon.querySelector(".description"); // Get the description text

  // Add click event listener to the icon
  icon.addEventListener("click", () => {
    if (description.style.display === "block") {
      description.style.display = "none"; // Hide the description if visible
    } else {
      description.style.display = "block"; // Show the description if hidden
    }
  });
  icon.addEventListener("click", () => {
    if (!animationInProgress && !icon.classList.contains("active")) {
      updateCircleAttributes();
      currentIconIndex = index;
      activeIconIndex = index;
      resetAllIconsAndProgress();
      handleIconClick(icon);
      updateIconVisibility();
    }
  });
});
function handleIconClick(icon) {
  const skill = icon.getAttribute("data-skill");
  const targetValue = skillLevels[skill];

  setActiveClass(iconElements, icon);

  // Show and animate progress ring
  const progressRing = icon.querySelector(".progress-ring");
  progressRing.style.display = "block"; // Show the progress ring
  const progressCircle = progressRing.querySelector(".progress-ring__circle");
  const percentageTextDiv = icon.querySelector(".percentage");

  animationInProgress = true; // Lock interactions while animation is in progress
  percentageTextDiv.textContent = "0%";
  percentageTextDiv.style.display = "block"; // Show the percentage div

  const descriptions = document.getElementsByClassName("description");

  for (let i = 0; i < descriptions.length; i++) {
    descriptions[i].style.display = "none";
  }
  animateSkillProgress(progressCircle, targetValue, percentageTextDiv);
}

function animateSkillProgress(circle, targetValue, percentageTextDiv) {
  const radius = circle.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = circumference;

  const duration = 2000;
  const startTime = performance.now();

  function animate() {
    const currentTime = performance.now();
    const progress =
      Math.min((currentTime - startTime) / duration, 1) * targetValue;
    const offset = circumference - (progress / 100) * circumference;
    circle.style.strokeDashoffset = offset;

    // Update stroke color based on progress
    const color = interpolateColor(progress, [255, 0, 0], [0, 255, 0]); // Interpolate color for visual feedback
    circle.style.stroke = color;

    // Calculate and update the percentage text during animation
    const interimPercentage = Math.round(progress); // Calculate interim percentage
    percentageTextDiv.textContent = `${interimPercentage}%`; // Update the text content

    if (progress < targetValue) {
      currentAnimationFrame = requestAnimationFrame(animate); // Continue animation if we haven't reached the target
    } else {
      animationInProgress = false; // Unlock interactions after animation finishes
    }
  }

  animate();
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

// Reset all icons and progress rings
function resetAllIconsAndProgress() {
  cancelOngoingAnimations();
  animationInProgress = false;

  // Reset states of all icons and hide progress rings
  iconElements.forEach((icon, index) => {
    icon.classList.remove("active");
    const progressRing = icon.querySelector(".progress-ring");
    if (progressRing) {
      progressRing.style.display = "none"; // Hide progress ring when resetting
      const circle = progressRing.querySelector(".progress-ring__circle");
      circle.style.strokeDashoffset = circle.r.baseVal.value * 2 * Math.PI; // Reset to start position
      circle.style.stroke = `rgb(255, 0, 0)`; // Reset color to red
    }

    // Reset percentage display
    const percentageTextDiv = icon.querySelector(".percentage");
    if (percentageTextDiv) {
      percentageTextDiv.textContent = "0%"; // Reset to 0%
      percentageTextDiv.style.display = "none"; // Hide percentage text
    }
  });
}

// Arrow functionality for the carousel
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");

let currentIndex = 0; // Track which set of icons is currently being viewed
function updateIconVisibility() {
  const activeIconData = iconData.find((icon) => icon.active);
  const activeIndex = activeIconData ? iconData.indexOf(activeIconData) : -1;

  iconData.forEach((icon) => {
    const isActiveIcon = icon.element?.classList.contains("active");

    if (isActiveIcon) {
      // Ensure that the active icon is always displayed
      icon.element.style.display = "block";
    } else if (activeIndex !== -1) {
      // If there’s an active index defined, show 4 icons centered around it
      const distance = Math.abs(icon.order - activeIconData.order);
      icon.element.style.display = distance <= 3 ? "block" : "none";
    } else {
      // If there is no active icon, show 4 icons based on the currentIndex
      icon.element.style.display =
        icon.order >= currentIndex + 1 && icon.order <= currentIndex + 5
          ? "block"
          : "none";
    }
  });
  // Update arrow visibility and disable state
  const canMoveLeft = currentIndex > 0;
  const canMoveRight = currentIndex + 5 < iconData.length;

  leftArrow.style.opacity = canMoveLeft ? "1" : "0.5";
  leftArrow.style.cursor = canMoveLeft ? "pointer" : "not-allowed";
  leftArrow.disabled = !canMoveLeft; // Disable left arrow if at the beginning

  rightArrow.style.opacity = canMoveRight ? "1" : "0.5";
  rightArrow.style.cursor = canMoveRight ? "pointer" : "not-allowed";
  rightArrow.disabled = !canMoveRight; // Disable right arrow if at the end
}

// Event Listeners for the arrows
leftArrow.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
  }
  updateIconVisibility();
});

rightArrow.addEventListener("click", () => {
  if (currentIndex < iconData.length - 4) {
    currentIndex++;
  }
  updateIconVisibility();
});

function updateCircleAttributes() {
  const circle = document.querySelector(".progress-ring__circle");
  if (window.innerWidth <= 480 && circle) {
    circle.setAttribute("r", 25); // Change radius for small screens
    circle.setAttribute("cx", 40); // Adjust center x for small screens
    circle.setAttribute("cy", 40); // Adjust center y for small screens
  } else {
    circle.setAttribute("r", 34); // Revert to original radius
    circle.setAttribute("cx", 58); // Revert to original center x
    circle.setAttribute("cy", 58); // Revert to original center y
  }
}

// Initial call to set attributes based on current window size
updateCircleAttributes();

updateIconVisibility(); // Initial call to set visibility on load
// Add event listener to update attributes on resize
window.addEventListener("resize", updateCircleAttributes);

setTimeout(() => {
  sections[4].classList.remove("active");
}, 1500);
