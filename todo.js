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
      const taskText = input.value.trim();
  
      if (!taskText) return;
  
      // Sanitize input to prevent XSS
      const sanitizedTaskText = taskText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  
      // Create a new task element
      const newTask = createTaskElement(sanitizedTaskText);
  
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
      if (archivedLane.style.display === 'none') {
          archivedLane.style.display = 'flex';
          archiveIcon.style.fill = '#ffc2d1';
      } else {
          archivedLane.style.display = 'none';
          archiveIcon.style.fill = 'white';
      }
    });
  
    archiveIcon.addEventListener("mouseenter", () => {
      if (archivedLane.style.display === 'none') {
        archiveIcon.style.fill = '#ffc2d1';
      }
    });
  
    archiveIcon.addEventListener("mouseleave", () => {
      if (archivedLane.style.display === 'none') {
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
  
      const laneElements = {
        todo: todoLane,
        done: doneLane,
        doing: doingLane,
        archived: archivedLane
      };
  
      Object.keys(lanes).forEach(laneName => {
        laneElements[laneName].querySelectorAll(".task").forEach(task => {
          const taskTitle = task.querySelector("p").innerText;
          const attributes = {};
          task.querySelectorAll(".task-attribute").forEach(attr => {
            const key = attr.querySelector("strong").innerText.replace(": ", "");
            const valueElement = attr.querySelector("span");
            const value = valueElement ? valueElement.innerText : "Click to edit";
            attributes[key] = value === "Click to edit" ? "" : value;
          });
          lanes[laneName].push({ title: taskTitle, attributes });
        });
      });
  
      localStorage.setItem("lanes", JSON.stringify(lanes));
    }
  
    // Load tasks from localStorage
    function loadTasks() {
      const storedLanes = JSON.parse(localStorage.getItem("lanes"));
      if (storedLanes) {
        const loadLane = (lane, tasks) => {
          tasks.forEach(taskData => {
            const task = createTaskElement(taskData.title);
  
            const details = task.querySelector(".task-details");
            if (taskData.attributes && typeof taskData.attributes === "object") {
              for (const [key, value] of Object.entries(taskData.attributes)) {
                const attributeDivs = details.querySelectorAll(".task-attribute");
                attributeDivs.forEach(attribute => {
                  const label = attribute.querySelector("strong").innerText.trim(); // Trim whitespace
  
                  if (label === key.trim()) { // Ensure both are trimmed and compared
                    attribute.querySelector("span").innerText = value || "Click to edit";
                  }
                });
              }
            } else {
              console.warn("Task attributes missing or invalid:", taskData);
            }
  
            lane.appendChild(task);
          });
        };
  
        loadLane(todoLane, storedLanes.todo || []);
        loadLane(doneLane, storedLanes.done || []);
        loadLane(doingLane, storedLanes.doing || []);
        loadLane(archivedLane, storedLanes.archived || []);
      } else {
        console.warn("No valid lanes data found in localStorage. Initializing empty lanes.");
        localStorage.setItem("lanes", JSON.stringify({
          todo: [],
          done: [],
          doing: [],
          archived: []
        }));
      }
    }
  
    // Create a task element
    function createTaskElement(title, attributes = {}) {
      const task = document.createElement("div");
      task.classList.add("task");
      task.setAttribute("draggable", "true");
  
      const taskTitle = document.createElement("p");
      taskTitle.innerText = title;
  
      const taskDetails = createTaskDetails(attributes);
  
      task.appendChild(taskTitle);
      task.appendChild(taskDetails);
  
      taskTitle.addEventListener("click", () => {
        task.classList.toggle("task-expanded");
      });
  
      task.addEventListener("dragstart", () => {
        task.classList.add("is-dragging");
      });
  
      task.addEventListener("dragend", () => {
        task.classList.remove("is-dragging");
        saveTasks();
      });
  
      return task;
    }
  
    // Create task details (Desc and Ref)
    function createTaskDetails(attributes = {}) {
      const taskDetails = document.createElement("div");
      taskDetails.classList.add("task-details");
  
      const placeholderAttributes = {
        Desc: "Click to edit",
        Ref: "Click to edit"
      };
  
      for (const [key, defaultValue] of Object.entries(placeholderAttributes)) {
        const attribute = document.createElement("div");
        attribute.classList.add("task-attribute");
  
        const label = document.createElement("strong");
        label.innerText = `${key}: `;
  
        const text = document.createElement("span");
        text.innerText = attributes[key] || defaultValue;
        text.style.cursor = "pointer";
  
        text.addEventListener("click", () => {
          const input = document.createElement("input");
          input.type = "text";
          input.value = text.innerText === "Click to edit" ? "" : text.innerText;
  
          input.addEventListener("blur", () => {
            text.innerText = input.value || "Click to edit";
            attribute.replaceChild(text, input);
            saveTasks();
          });
  
          input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              input.blur();
            }
          });
  
          attribute.replaceChild(input, text);
          input.focus();
        });
  
        attribute.appendChild(label);
        attribute.appendChild(text);
        taskDetails.appendChild(attribute);
      }
  
      return taskDetails;
    }
  });
  