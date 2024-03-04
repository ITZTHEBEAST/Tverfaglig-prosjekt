document.addEventListener("DOMContentLoaded", function () {
    loadTasksFromLocalStorage();
  });
  
  const addBtn = document.querySelector(".add-btn");
  const taskInput = document.getElementById("task-input");
  const taskList = document.querySelector(".task-items");
  const clearAll = document.querySelector(".clear-tasks");
  const searchInput = document.getElementById("search");
  
  addBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();
  
    if (taskText !== "") {
      const newLi = createTaskElement(taskText);
      taskList.appendChild(newLi);
  
      // Save tasks to local storage
      saveTasksToLocalStorage();
  
      // Update search filter
      updateSearchFilter();
  
      taskInput.value = "";
    } else {
      const err = document.querySelector(".err");
      err.style.display = "block";
      setTimeout(() => {
        err.style.display = "none";
      }, 2000);
    }
  });
  
  clearAll.addEventListener("click", function (e) {
    e.preventDefault();
  
    // Clear the task list
    taskList.innerHTML = "";
  
    // Save an empty task list to local storage
    saveTasksToLocalStorage();
  
    // Update search filter (to hide all items since the list is empty)
    updateSearchFilter();
  });
  
  searchInput.addEventListener("input", function () {
    updateSearchFilter();
  });
  
  function createTaskElement(taskText) {
    const newLi = document.createElement("li");
    newLi.className = "task";
    newLi.style.margin = ".5rem 0rem";
  
    const task = document.createElement("input");
    task.disabled = true;
    task.type = "text";
    task.className = "taskDisabled";
    task.value = taskText;
  
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener("click", function () {
      newLi.remove();
      saveTasksToLocalStorage();
      updateSearchFilter();
    });
  
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.innerText = "Edit";
    editBtn.addEventListener("click", function () {
      task.disabled = !task.disabled;
      if (!task.disabled) {
        task.focus();
      }
      saveTasksToLocalStorage();
    });
  
    newLi.appendChild(task);
    newLi.appendChild(deleteBtn);
    newLi.appendChild(editBtn);
  
    return newLi;
  }
  
  function saveTasksToLocalStorage() {
    const tasks = document.querySelectorAll(".task");
    const tasksData = [];
  
    tasks.forEach((task) => {
      const taskText = task.querySelector(".taskDisabled").value;
      tasksData.push({ taskText });
    });
  
    localStorage.setItem("tasks", JSON.stringify(tasksData));
  }
  
  function loadTasksFromLocalStorage() {
    const tasksData = JSON.parse(localStorage.getItem("tasks")) || [];
  
    tasksData.forEach((taskData) => {
      const newLi = createTaskElement(taskData.taskText);
      taskList.appendChild(newLi);
    });
  }
  
  function updateSearchFilter() {
    let searchedWord = searchInput.value.trim().toLowerCase();
  
    const taskItems = document.querySelectorAll(".task");
    taskItems.forEach((taskItem) => {
      let taskText = taskItem
        .querySelector(".taskDisabled")
        .value.trim()
        .toLowerCase();
  
      // Check if the taskText contains the searchedWord
      if (taskText.includes(searchedWord)) {
        taskItem.style.display = "block";
      } else {
        taskItem.style.display = "none";
      }
    });
  }