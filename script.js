document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const clearAllBtn = document.getElementById('clearAll');

    // Load tasks from localStorage
    loadTasks();

    // Add task
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Clear buttons
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    clearAllBtn.addEventListener('click', clearAllTasks);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const taskItem = createTaskElement(taskText);
        taskList.appendChild(taskItem);
        taskInput.value = '';
        
        saveTasks();
    }

    function createTaskElement(taskText) {
        const li = document.createElement('li');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', function() {
            li.classList.toggle('completed');
            saveTasks();
        });
        
        const span = document.createElement('span');
        span.textContent = taskText;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', function() {
            li.remove();
            saveTasks();
        });
        
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        
        return li;
    }

    function clearCompletedTasks() {
        const completedTasks = document.querySelectorAll('li.completed');
        completedTasks.forEach(task => task.remove());
        saveTasks();
    }

    function clearAllTasks() {
        if (confirm('Are you sure you want to delete all tasks?')) {
            taskList.innerHTML = '';
            saveTasks();
        }
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('#taskList li').forEach(li => {
            tasks.push({
                text: li.querySelector('span').textContent,
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            const tasks = JSON.parse(savedTasks);
            tasks.forEach(task => {
                const taskItem = createTaskElement(task.text);
                if (task.completed) {
                    taskItem.classList.add('completed');
                    taskItem.querySelector('input[type="checkbox"]').checked = true;
                }
                taskList.appendChild(taskItem);
            });
        }
    }
});