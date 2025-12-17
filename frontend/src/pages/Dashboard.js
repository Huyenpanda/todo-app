
document.addEventListener("DOMContentLoaded", function () {
  const menuItems = document.querySelectorAll(".menu-item");
  const sections = document.querySelectorAll("main .main > div, main > div");

  menuItems.forEach(item => {
    item.addEventListener("click", function () {
       
      menuItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
     
      const sectionName = item.textContent.trim().replace("&", "").replace("#", "").split(" ")[0];

      sections.forEach(section => {
        section.style.display = "none";
      });

    
      const targetSection = document.querySelector(`.${sectionName}`);
      if (targetSection) {
        targetSection.style.display = "block";
      }
    });
  });


  const addTaskMainBtn = document.querySelector(".add-task-main");
  const emptyBox = document.querySelector(".Inbox .empty-box");
  const taskEntryBox = document.querySelector(".Inbox .task-entry-box");
  const cancelTaskBtn = document.querySelector(".cancel-task");

  if (addTaskMainBtn && emptyBox && taskEntryBox) {
    addTaskMainBtn.addEventListener("click", function () {
      emptyBox.style.display = "none";
      taskEntryBox.style.display = "block";
    });

    cancelTaskBtn.addEventListener("click", function () {
      taskEntryBox.style.display = "none";
      emptyBox.style.display = "block";
    });
  }
});