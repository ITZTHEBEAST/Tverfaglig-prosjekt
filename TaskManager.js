// Funksjon for å lagre oppgaver lokalt
function saveTasksToLocalStorage() {
    try {
        const tasks = [];
        const taskItems = document.querySelectorAll(".task");

        taskItems.forEach(taskItem => {
            const taskId = taskItem.dataset.taskId;
            const taskText = taskItem.querySelector(".taskDisabled").value.trim();

            tasks.push({ taskId, taskText });
        });

        // Lagre oppgaver lokalt
        localStorage.setItem("tasks", JSON.stringify(tasks));

        console.log("Tasks saved to local storage:", tasks); // Log saved tasks
    } catch (error) {
        console.error("Error saving tasks to local storage:", error);
    }
}


document.addEventListener("DOMContentLoaded", function () {
    try {
        loadTasksFromDatabase(); // Hent oppgaver fra databasen ved start
    } catch (error) {
        console.error("Error loading tasks from database:", error);
    }
});

const addBtn = document.querySelector(".add-btn");
const taskInput = document.getElementById("task-input");
const taskList = document.querySelector(".task-items");
const clearAll = document.querySelector(".clear-tasks");
const searchInput = document.getElementById("search");

// Event-lytter for å tømme alle oppgaver
clearAll.addEventListener("click", function (e) {
    try {
        e.preventDefault();

        // Fjern alle oppgaver fra UI og databasen
        const tasks = document.querySelectorAll(".task");
        tasks.forEach(task => {
            task.remove();
            deleteTaskFromDatabase(task.dataset.taskId); // Slett oppgaven fra databasen
        });

        updateSearchFilter(); // Oppdater søkefilteret etter å ha fjernet alle oppgaver
        saveTasksToLocalStorage(); // Lagre oppgaver lokalt etter å ha fjernet alle oppgaver
    } catch (error) {
        console.error("Error clearing all tasks:", error);
    }
});

// Event-lytter for å legge til oppgaver
addBtn.addEventListener("click", function (e) {
    try {
        e.preventDefault();
        const taskText = taskInput.value.trim();

        if (taskText !== "") {
            // Send data til serveren ved hjelp av Fetch API for å legge til en ny oppgave i databasen
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
                        // Hvis oppgaven er lagt til, opprett og legg til oppgaveelementet
                        const newLi = createTaskElement(data.taskText, data.taskId);
                        taskList.appendChild(newLi);
                        updateSearchFilter(); // Oppdater søkefilteret etter å ha lagt til en ny oppgave
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
    } catch (error) {
        console.error("Error adding task:", error);
    }
});

// Funksjon for å opprette et oppgaveelement
function createTaskElement(taskText, taskId) {
    try {
        const newLi = document.createElement("li");
        newLi.className = "task my-2 p-4 bg-white border rounded-md transition duration-300 hover:shadow-md";
        newLi.dataset.taskId = taskId; // Sett data-task-id-attributtet for å lagre oppgave-ID-en

        const task = document.createElement("input");
        task.disabled = true;
        task.type = "text";
        task.className = "taskDisabled p-2 bg-gray-100 rounded";

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn ml-2 p-2 bg-red-500 text-white rounded transition duration-300 transform hover:scale-105";
        deleteBtn.innerText = "Slett";
        deleteBtn.addEventListener("click", function () {
            newLi.remove();
            deleteTaskFromDatabase(taskId); // Slett oppgaven fra databasen
            updateSearchFilter(); // Oppdater søkefilteret etter å ha slettet en oppgave
            saveTasksToLocalStorage(); // Lagre oppgaver lokalt etter å ha slettet en oppgave
        });

        const completeBtn = document.createElement("button");
        completeBtn.className = "complete-btn ml-2 p-2 bg-green-500 text-white rounded transition duration-300 transform hover:scale-105";
        completeBtn.innerText = "Ferdig";
        completeBtn.addEventListener("click", function () {
            newLi.remove();
            deleteTaskFromDatabase(taskId); // Slett oppgaven fra databasen
            updateSearchFilter(); // Oppdater søkefilteret etter å ha fullført en oppgave
            saveTasksToLocalStorage(); // Lagre oppgaver lokalt etter å ha fullført en oppgave
        });

        newLi.appendChild(task);
        newLi.appendChild(deleteBtn);
        newLi.appendChild(completeBtn);
        task.value = taskText;

        return newLi;
    } catch (error) {
        console.error("Error creating task element:", error);
    }
}

// Funksjon for å hente oppgaver fra databasen
function loadTasksFromDatabase() {
    try {
        // Fjern eksisterende oppgaver
        taskList.innerHTML = '';

        // Hent oppgaver fra databasen og opprett oppgaveelementer
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
    } catch (error) {
        console.error("Error loading tasks from database:", error);
    }
}

// Funksjon for å slette oppgave fra databasen
function deleteTaskFromDatabase(taskId) {
    try {
        // Send data til serveren ved hjelp av Fetch API for å slette oppgave fra databasen
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
    } catch (error) {
        console.error("Error deleting task from database:", error);
    }
}
