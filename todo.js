document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const archiveButton = document.getElementById("archive");
  const archiveIcon = document.getElementById("archive-icon");
  const todoLane = document.getElementById("todo-lane");
  const doneLane = document.getElementById("done-lane");
  const doingLane = document.getElementById("doing-lane");
  const archivedLane = document.getElementById("archived-lane");

  archivedLane.style.display = 'none';

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

  archiveIcon.addEventListener("mouseenter", (e) => {
    if (archivedLane.style.display === 'none') {
      archiveIcon.style.fill = '#ffc2d1';
    }
  })

  archiveIcon.addEventListener("mouseleave", () => {
    // Display archived tasks
    if (archivedLane.style.display === 'none') {
      archiveIcon.style.fill = 'white';
    }
  })

  // Save tasks to localStorage
  function saveTasks() {
    const lanes = {
        todo: [],
        done: [],
        doing: [],
        archived: []
    };

    const saveLane = (lane, tasks) => {
        lane.querySelectorAll(".task").forEach(task => {
            const taskTitle = task.querySelector("p").innerText;
            const taskDetails = task.querySelector(".task-details").innerText;
            tasks.push({ title: taskTitle, details: taskDetails });
        });
    };

    saveLane(todoLane, lanes.todo);
    saveLane(doneLane, lanes.done);
    saveLane(doingLane, lanes.doing);
    saveLane(archivedLane, lanes.archived);

    localStorage.setItem("lanes", JSON.stringify(lanes));
}

  // Load tasks from localStorage
  function loadTasks() {
        const storedLanes = JSON.parse(localStorage.getItem("lanes"));
        if (storedLanes) {
            const loadLane = (lane, tasks) => {
                tasks.forEach(taskData => {
                    const task = createTaskElement(taskData.title);
                    lane.appendChild(task);
                });
            };

            loadLane(todoLane, storedLanes.todo);
            loadLane(doneLane, storedLanes.done);
            loadLane(doingLane, storedLanes.doing);
            loadLane(archivedLane, storedLanes.archived);
        }
    }

    // Create a task element
    function createTaskElement(title) {
        const task = document.createElement("div");
        task.classList.add("task");
        task.setAttribute("draggable", "true");
    
        // Task Title
        const taskTitle = document.createElement("p");
        taskTitle.innerText = title;
    
        // Task Details Section
        const taskDetails = document.createElement("div");
        taskDetails.classList.add("task-details");
    
        // Add placeholder attributes
        const placeholderAttributes = {
            Desc: "Click to edit",
            Ref: "Click to edit"
        };
    
        for (const [key, value] of Object.entries(placeholderAttributes)) {
            const attribute = document.createElement("div");
            attribute.classList.add("task-attribute");
    
            const label = document.createElement("strong");
            label.innerText = `${key}: `;
    
            const text = document.createElement("span");
            text.innerText = value;
            text.style.cursor = "pointer";
    
            // Make the text editable on click
            text.addEventListener("click", () => {
                const input = document.createElement("input");
                input.type = "text";
                input.value = text.innerText === "Click to edit" ? "" : text.innerText;
    
                input.addEventListener("blur", () => {
                    text.innerText = input.value || "Click to edit";
                    attribute.replaceChild(text, input);
                    saveTasks(); // Save changes
                });
    
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        input.blur(); // Commit the change on Enter
                    }
                });
    
                attribute.replaceChild(input, text);
                input.focus();
            });
    
            attribute.appendChild(label);
            attribute.appendChild(text);
            taskDetails.appendChild(attribute);
        }
    
        // Append title and details
        task.appendChild(taskTitle);
        task.appendChild(taskDetails);
    
        // Toggle details on click
        taskTitle.addEventListener("click", () => {
            task.classList.toggle("task-expanded");
        });
    
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
