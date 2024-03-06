document.addEventListener("DOMContentLoaded", function () {
    loadTasksFromDatabase(); // Load tasks from the database initially
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
      // Send data to the server using Fetch API to add a new task to the database
      fetch("InsertData.php", {
        method: "POST",
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
        body: "taskText=" + encodeURIComponent(taskText),
      })
        .then(response => response.json())
        .then(data => {
          console.log("Server Response:", data);
          if (data.status === 'success') {
            // If the task is added successfully, create and append the task element
            const newLi = createTaskElement(data.taskText, data.taskId);
            taskList.appendChild(newLi);
            updateSearchFilter(); // Update search filter after adding a new task
          } else {
            console.error(data.message);
          }
        })
        .catch(error => {
          console.error("Fetch Error:", error);
        });
  
      taskInput.value = "";
    } else {
      const err = document.querySelector(".err");
      err.classList.remove("hidden");
      setTimeout(() => {
        err.classList.add("hidden");
      }, 2000);
    }
  });
  
  clearAll.addEventListener("click", function (e) {
    e.preventDefault();
  
    // Remove all tasks from the UI and the database
    const tasks = document.querySelectorAll(".task");
    tasks.forEach(task => {
      task.remove();
      deleteTaskFromDatabase(task.dataset.taskId); // Delete the task from the database
    });
  
    updateSearchFilter(); // Update search filter after clearing all tasks
  });
  
  searchInput.addEventListener("input", function () {
    updateSearchFilter();
  });
  
  function createTaskElement(taskText, taskId) {
    const newLi = document.createElement("li");
    newLi.className = "task my-2 p-4 bg-white border rounded-md transition duration-300 hover:shadow-md";
    newLi.dataset.taskId = taskId; // Set data-task-id attribute to store the task ID
  
    const task = document.createElement("input");
    task.disabled = true;
    task.type = "text";
    task.className = "taskDisabled p-2 bg-gray-100 rounded";
  
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn ml-2 p-2 bg-red-500 text-white rounded transition duration-300 transform hover:scale-105";
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener("click", function () {
      newLi.remove();
      deleteTaskFromDatabase(taskId); // Delete the task from the database
      updateSearchFilter(); // Update search filter after deleting a task
    });
  
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn ml-2 p-2 bg-blue-500 text-white rounded transition duration-300 transform hover:scale-105";
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
    task.value = taskText;
  
    return newLi;
  }
  
  function loadTasksFromDatabase() {
    // Clear existing tasks
    taskList.innerHTML = '';
  
    // Fetch tasks from the database and create task elements
    fetch("GetData.php")
      .then(response => response.json())
      .then(data => {
        console.log("Server Response:", data);
        if (data.status === 'success') {
          data.tasks.forEach(task => {
            const newLi = createTaskElement(task.taskText, task.taskId);
            taskList.appendChild(newLi);
          });
        } else {
          console.error(data.message);
        }
      })
      .catch(error => {
        console.error("Fetch Error:", error);
      });
  }
  
  function deleteTaskFromDatabase(taskId) {
    // Send data to the server using Fetch API to delete a task from the database
    fetch("DeleteData.php", {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
      body: "taskId=" + encodeURIComponent(taskId),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Server Response:", data);
        if (data.status !== 'success') {
          console.error(data.message);
        }
      })
      .catch(error => {
        console.error("Fetch Error:", error);
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
  