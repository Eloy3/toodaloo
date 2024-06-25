document.addEventListener("DOMContentLoaded", () => {
  // Define element references
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const archiveButton = document.getElementById("archive");
  const archiveIcon = document.getElementById("archive-icon");
  const todoLane = document.getElementById("todo-lane");
  const doneLane = document.getElementById("done-lane");
  const doingLane = document.getElementById("doing-lane");
  const archivedLane = document.getElementById("archived-lane");

  // Load tasks from localStorage
  loadTasks();

  form.addEventListener('submit', (e) => {
      e.preventDefault();
      const taskText = input.value;

      if (!taskText) { return; }

      // Create a new task element
      const newTask = createTaskElement(taskText);

      // Append the new task to the todo-lane
      todoLane.appendChild(newTask);

      // Clear the input field
      input.value = "";
      saveTasks();
  });

  archiveButton.addEventListener("click", () => {
      // Move tasks to archive
      const tasks = doneLane.querySelectorAll(".task");
      tasks.forEach(task => {
          archivedLane.appendChild(task);
      });
      saveTasks();
  });

  archiveIcon.addEventListener("click", () => {
      // Display archived tasks
      if (archivedLane.style.display === 'none') {
          archivedLane.style.display = 'flex';
          archiveIcon.style.fill = '#ffc2d1';
      } else {
          archivedLane.style.display = 'none';
          archiveIcon.style.fill = 'white';
      }
  });

  // Save tasks to localStorage
  function saveTasks() {
      const lanes = {
          todo: [],
          done: [],
          doing: [],
          archived: []
      };

      todoLane.querySelectorAll(".task").forEach(task => lanes.todo.push(task.innerText));
      doneLane.querySelectorAll(".task").forEach(task => lanes.done.push(task.innerText));
      doingLane.querySelectorAll(".task").forEach(task => lanes.doing.push(task.innerText));
      archivedLane.querySelectorAll(".task").forEach(task => lanes.archived.push(task.innerText));

      localStorage.setItem("lanes", JSON.stringify(lanes));
  }

  // Load tasks from localStorage
  function loadTasks() {
      const storedLanes = JSON.parse(localStorage.getItem("lanes"));
      if (storedLanes) {
          storedLanes.todo.forEach(taskText => {
              const task = createTaskElement(taskText);
              todoLane.appendChild(task);
          });
          storedLanes.done.forEach(taskText => {
              const task = createTaskElement(taskText);
              doneLane.appendChild(task);
          });
          storedLanes.doing.forEach(taskText => {
              const task = createTaskElement(taskText);
              doingLane.appendChild(task);
          });
          storedLanes.archived.forEach(taskText => {
              const task = createTaskElement(taskText);
              archivedLane.appendChild(task);
          });
      }
  }

  // Create a task element
  function createTaskElement(text) {
      const task = document.createElement("p");
      task.classList.add("task");
      task.setAttribute("draggable", "true");
      task.innerText = text;

      task.addEventListener("dragstart", () => {
          task.classList.add("is-dragging");
      });

      task.addEventListener("dragend", () => {
          task.classList.remove("is-dragging");
          saveTasks(); // Save tasks when dragging ends
      });

      return task;
  }
});
