const taskInput = document.querySelector(".task-input input"),
filters = document.querySelectorAll(".filters span"), // взять 
clearAll = document.querySelector(".clear-btn"),
taskBox = document.querySelector(".task-box");

let editId;
let isEditedTask = false;
let todos = JSON.parse(localStorage.getItem("todo-list")); // сохранить данные в localstorage

// taskInput.addEventListener("keyup", e => {
//     let userTask = taskInput.value;
//     if(e.key == "Enter") {
//         console.log(userTask)
//     }
// });

// взять данные с input в localstorage
taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if(e.key == "Enter" && userTask) {
        if (!isEditedTask) {
            if(!todos) { // если инпут пустой, не выводит пустую задачи
                todos = [];
            }
            let taskInfo = {name: userTask, status: "pending"};
            todos.push(taskInfo);
        } else {
            isEditedTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo("all");
    }
});
// функция чтобы вывести данные с localstorage в виде задачи 
function showTodo(filter) {
    let li = "";
    if(todos) {
        todos.forEach((todo, id) => {
            // if todo  status is comleted, set the isComplated value to checked
            let isCompleted = todo.status == "completed" ? "checked" : "";
            if(filter == todo.status || filter == "all") {
                li += `<li class="task">
                <label for="${id}">
                    <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                    <p class="${isCompleted}">${todo.name}</p>
                </label>
                <div class="settings">
                    <img onclick="showMenu(this)" src="points.png" alt="" class="setting">
                    <ul class="task-menu">
                        <li onclick="editTask(${id}, '${todo.name}')"><img src="pen.png" alt="pen" width="15px">Edit</li>
                        <li onclick="deleteTask(${id})" ><img src="bin.png" alt="trash" width="15px">Delete</li>
                    </ul>
                </div>
           </li>`;
            }
        });
    }
    taskBox.innerHTML = li || `<span>You do not have any task here</span>`;
}
// вызвать функцию
showTodo("all")
// функция чтобы показать меню задачи
function showMenu(selectedTask) {
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != selectedTask) {
            taskMenu.classList.remove("show");
        }
    });
};
// редактировать задачу
function editTask(taskId, taskName) {
    editId = taskId;
    isEditedTask = true;
    // console.log(taskId, taskName);
    taskInput.value = taskName;
};
// удалить задачу
function deleteTask(deleteId) {
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
};
// менять статус задачи
function updateStatus(selectedTask){
    // взять абзац в котором содержится название задачи
    let taskName = selectedTask.parentElement.lastElementChild;
    // console.log(selectedTask)
    if(selectedTask.checked){
        taskName.classList.add("checked");
        // изменить на статус выполнено
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
            // изменить на статус в ожидании
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
};
// фильтрировать задачи по статусу 
filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});
// удалить все задачи с доски 
clearAll.addEventListener("click", () => {
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
})
