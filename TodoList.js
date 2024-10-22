document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');
    const addTaskButton = document.getElementById('add-task');
    const searchInput = document.getElementById('search');
    const filterSelect = document.getElementById('filter');
  
    let tasks = [];
  
    // Load tasks from localStorage
    if (localStorage.getItem('tasks')) {
      tasks = JSON.parse(localStorage.getItem('tasks'));
      renderTasks();
    }
  
    // Add new task
    addTaskButton.addEventListener('click', function() {
      const taskText = taskInput.value.trim();
      if (taskText === '') return;
  
      const newTask = {
        text: taskText,
        completed: false,
      };
      tasks.push(newTask);
      taskInput.value = '';
      saveTasks();
      renderTasks();
    });
  
    // Task operations (CRUD)
    function renderTasks() {
      taskList.innerHTML = '';
  
      tasks
        .filter(task => {
          const searchTerm = searchInput.value.toLowerCase();
          const matchesSearch = task.text.toLowerCase().includes(searchTerm);
  
          if (filterSelect.value === 'all') return matchesSearch;
          if (filterSelect.value === 'completed') return matchesSearch && task.completed;
          if (filterSelect.value === 'uncompleted') return matchesSearch && !task.completed;
        })
        .forEach((task, index) => {
          const li = document.createElement('li');
          li.className = 'task-item' + (task.completed ? ' completed' : '');
  
          const span = document.createElement('span');
          span.textContent = task.text;
          li.appendChild(span);
  
          // Complete/Uncomplete task
          span.addEventListener('click', function() {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
          });
  

           // **Edit Task Button**
        const editButton = document.createElement('button');
        editButton.innerHTML = '✎'; // Using pencil icon for editing
        editButton.className = 'edit-btn';
        editButton.addEventListener('click', function() {
          const editInput = document.createElement('input');
          editInput.type = 'text';
          editInput.value = task.text;
          li.replaceChild(editInput, span);
  
            editInput.addEventListener('keypress', function(event) {
              if (event.key === 'Enter') {
                const updatedText = editInput.value.trim();
                if (updatedText === '') return;
  
                task.text = updatedText; // Update task text
                saveTasks();
                renderTasks();
              }
            });
  
            // If the user clicks away, restore the task without updating
            editInput.addEventListener('blur', function() {
              renderTasks(); // Re-render to revert if not edited
            });
          });
          li.appendChild(editButton); // Append edit button


          // Delete task
          const deleteButton = document.createElement('button');
          deleteButton.innerHTML = '✖';
          deleteButton.addEventListener('click', function() {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
          });
          li.appendChild(deleteButton);
  
          taskList.appendChild(li);
        });
    }
  
    // Save tasks to localStorage
    function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  
    // Search functionality
    searchInput.addEventListener('input', renderTasks);
  
    // Filter functionality
    filterSelect.addEventListener('change', renderTasks);
  });
  
 