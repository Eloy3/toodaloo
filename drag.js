const tasks = document.querySelectorAll(".task");
const boards = document.querySelectorAll(".swim-lane");
const trashIcon = document.querySelector(".icons .bi-trash");

tasks.forEach((task) => {
    task.addEventListener("dragstart", () => {
      task.classList.add("is-dragging");
    });
    task.addEventListener("dragend", () => {
      task.classList.remove("is-dragging");
    });
  });

  boards.forEach((board) => {
    board.addEventListener("dragover", (e) => {
        e.preventDefault();
        const bottomTask = insertAboveTask(board, e.clientY);
        const curTask = document.querySelector(".is-dragging");

        if(!bottomTask){
            board.appendChild(curTask);
        }else{
            board.insertBefore(curTask, bottomTask);
        }
    });
  });

  trashIcon.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!trashIcon.classList.contains("drag-over")) {
      trashIcon.classList.add("drag-over");
    }
  });
  trashIcon.addEventListener("dragleave", () => {
    trashIcon.classList.remove("drag-over");
  });
  trashIcon.addEventListener("drop", (e) => {
    e.preventDefault();
    trashIcon.classList.remove("drag-over");
    const curTask = document.querySelector(".is-dragging");
    if (curTask) {
      curTask.remove();
    }
  });

  function insertAboveTask(zone, mouseY){
    const els = zone.querySelectorAll(".task:not(.is-dragging)");

    let closestTask = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    els.forEach((task) => {
        const top = task.getBoundingClientRect().top;
        const newOffset = mouseY - top;

        if(newOffset>closestOffset && newOffset<0){
            closestOffset = newOffset;
            closestTask = task;
        }
    });
    return closestTask;
  }