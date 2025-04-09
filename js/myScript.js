const resumeList = document.querySelectorAll(".resume-list");

// navbar actions and all section actions along with cube rotation when navbar is clicked

// resume section when clicking tab-list
resumeList.forEach((list, indx) => {
  list.addEventListener("click", () => {
    document.querySelector(".resume-list.active").classList.remove("active");
    list.classList.add("active");
  });
});
// portfolio section when clicking tab-list

// visibility for contact section when reloading (cube reloading animation)
