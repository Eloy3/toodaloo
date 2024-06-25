document.getElementById('todo-form').addEventListener('submit', (e)=> {
    
    e.preventDefault();
    // Get the value from the input field
    const input = document.getElementById('todo-input');
    const taskText = input.value; 

    if (!taskText) {return}
  
    // Ensure the input is not empty
    else{
      // Create a new task element
      const newTask = document.createElement('p');
      newTask.className = 'task';
      newTask.draggable = true;
      newTask.textContent = taskText;
  
      newTask.addEventListener("dragstart", () => {
        newTask.classList.add("is-dragging");
      });
    
      newTask.addEventListener("dragend", () => {
        newTask.classList.remove("is-dragging");
      });
      // Append the new task to the todo-lane
      document.getElementById('todo-lane').appendChild(newTask);
  
      // Clear the input field
      input.value = "";
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const archiveButton = document.getElementById("archive");
    const archiveIcon = document.getElementById("archive-icon");
    const todoLane = document.getElementById("done-lane");
    const archiveBoard = document.getElementById("archive-board");
    const archivedLane = document.getElementById("archived-lane");

    let archivedTasks = [];

    archiveButton.addEventListener("click", () => {
        // Move tasks to archive
        const tasks = todoLane.querySelectorAll(".task");
        tasks.forEach(task => {
            archivedTasks.push(task.outerHTML); // Save task HTML to array
            task.remove(); // Remove task from the "Toodaloo" lane
        });
    });

    archiveIcon.addEventListener("click", () => {
        // Display archived tasks
        archivedLane.innerHTML = archivedTasks.join(""); // Load tasks into archived lane
        archiveBoard.style.display = "block"; // Show the archive board
    });
});

  