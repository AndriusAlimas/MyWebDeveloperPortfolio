const resumeList = document.querySelectorAll(".resume-list");
const resumeBoxs = document.querySelectorAll(".resume-box");

// navbar actions and all section actions along with cube rotation when navbar is clicked

// resume section when clicking tab-list
resumeList.forEach((list, indx) => {
  list.addEventListener("click", () => {
    document.querySelector(".resume-list.active").classList.remove("active");
    list.classList.add("active");

    document.querySelector(".resume-box.active").classList.remove("active");
    resumeBoxs[indx].classList.add("active");
  });
});

// Function to activate the skills tab and show the skills section
function activateTab(tabIndex) {
  const allTabs = document.querySelectorAll(".resume-box");
  allTabs.forEach((tab, index) => {
    tab.classList.remove("active"); // Hide all resume boxes
    if (index === tabIndex) {
      tab.classList.add("active"); // Show the skills tab
    }
  });
}

// portfolio section when clicking tab-list

// visibility for contact section when reloading (cube reloading animation)
