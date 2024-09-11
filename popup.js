document.addEventListener("DOMContentLoaded", () => {
    const taskNameInput = document.getElementById("taskName");
    const taskDetailsInput = document.getElementById("taskDetails");
    const taskDateInput = document.getElementById("taskDate");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");

    // Function to render tasks
    function renderTasks() {
        chrome.storage.local.get(["tasks"], (result) => {
            const tasks = result.tasks || [];
            tasks.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort tasks by date
            taskList.innerHTML = ""; // Clear current list
            tasks.forEach((task, index) => addTaskToList(task, index));
        });
    }

    // Load tasks from storage and display them
    renderTasks();

    // Add task button event listener
    addTaskBtn.addEventListener("click", () => {
        const taskName = taskNameInput.value;
        const taskDetails = taskDetailsInput.value;
        const taskDate = taskDateInput.value;

        if (taskName.trim() && taskDate) {
            const task = { 
                name: taskName, 
                details: taskDetails, 
                date: taskDate 
            };

            // Save the new task to storage
            chrome.storage.local.get(["tasks"], (result) => {
                const tasks = result.tasks || [];
                tasks.push(task);
                tasks.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort tasks by date
                chrome.storage.local.set({ tasks: tasks }, () => {
                    renderTasks(); // Refresh the list
                    taskNameInput.value = "";
                    taskDetailsInput.value = "";
                    taskDateInput.value = "";
                });
            });
        }
    });

    // Function to add a task to the list
    function addTaskToList(task, index) {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${task.name}</strong>
            <p>${task.details}</p>
            <small>Due: ${new Date(task.date).toLocaleDateString()}</small>
            <button class="deleteBtn" data-index="${index}">Delete</button>
        `;
        taskList.appendChild(listItem);

        // Add event listener to the delete button
        listItem.querySelector(".deleteBtn").addEventListener("click", (event) => {
            const taskIndex = parseInt(event.target.getAttribute("data-index"), 10);
            removeTask(taskIndex);
        });
    }

    // Function to remove a task
    function removeTask(index) {
        chrome.storage.local.get(["tasks"], (result) => {
            let tasks = result.tasks || [];
            tasks.splice(index, 1);
            chrome.storage.local.set({ tasks: tasks }, () => {
                renderTasks(); // Refresh the list
            });
        });
    }
});
