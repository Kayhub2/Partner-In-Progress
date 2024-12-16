// Function to add a new task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput').value;
    const categoryInput = document.getElementById('categoryInput').value;
    const taskList = document.getElementById('taskList');
    const taskValue = taskInput.value.trim();

    if (taskValue !== "") {
        const li = document.createElement('li');
        li.classList.add(priorityInput, categoryInput); // Add both priority and category as classes
        li.innerHTML = `
            <input type="checkbox" onchange="toggleTaskCompletion(this)">
            ${taskValue} - <strong>${categoryInput.toUpperCase()}</strong> - <strong>${priorityInput.toUpperCase()} Priority</strong>
            <button onclick="deleteTask(this)">Delete</button>
        `;
        taskList.appendChild(li);
        saveTasksToLocalStorage();
        taskInput.value = '';
    }
}

// Function to delete a task
function deleteTask(button) {
    const taskItem = button.parentNode;
    taskItem.remove();
    saveTasksToLocalStorage();
    updateProgress();
}

// Function to mark a task as completed
function toggleTaskCompletion(checkbox) {
    const taskItem = checkbox.parentNode;
    taskItem.style.textDecoration = checkbox.checked ? "line-through" : "none";
    saveTasksToLocalStorage();
    updateProgress();
}

// Function to save tasks to local storage
function saveTasksToLocalStorage() {
    const taskList = document.getElementById('taskList');
    const tasks = [];

    // Store tasks as an array of objects (with priority, category, and completion status)
    for (let i = 0; i < taskList.children.length; i++) {
        const task = taskList.children[i];
        const taskText = task.innerText.replace("Delete", "").trim();
        const isChecked = task.querySelector('input[type="checkbox"]').checked;
        tasks.push({
            text: taskText,
            priority: task.classList[0],
            category: task.classList[1],
            completed: isChecked
        });
    }

    // Save to local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from local storage when the page loads
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const taskList = document.getElementById('taskList');

    if (tasks) {
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.classList.add(task.priority, task.category);
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTaskCompletion(this)">
                ${task.text}
                <button onclick="deleteTask(this)">Delete</button>
            `;
            taskList.appendChild(li);
        });
    }
    updateProgress();
}

// Function to filter tasks based on priority and category
function filterTasks() {
    const priorityFilter = document.getElementById('filterPriority').value;
    const categoryFilter = document.getElementById('filterCategory').value;
    const tasks = document.querySelectorAll('#taskList li');

    tasks.forEach(task => {
        const matchesPriority = priorityFilter === 'all' || task.classList.contains(priorityFilter);
        const matchesCategory = categoryFilter === 'all' || task.classList.contains(categoryFilter);

        if (matchesPriority && matchesCategory) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
}

// Function to update the progress bar
function updateProgress() {
    const tasks = document.querySelectorAll('#taskList li');
    const completedTasks = document.querySelectorAll('#taskList li input:checked').length;
    const totalTasks = tasks.length;
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    const progressPercentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
    progressBar.style.width = progressPercentage + '%';
    progressText.textContent = `Completed: ${completedTasks} / ${totalTasks} tasks`;
}

// Load tasks when the page loads
window.onload = loadTasksFromLocalStorage;
