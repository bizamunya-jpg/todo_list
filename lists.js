(function() {
    "use strict";

    const input = document.getElementById("taskinput");
    const addBtn = document.getElementById("addBtn");
    const taskList = document.getElementById("tasklist");
    const inputRow = document.querySelector(".input-row");
    const tasks = [];

    window.app = window.app || {};
    window.app.currentUser = "";
    window.app.tasks = tasks;

    function setTodoVisibility(isVisible) {
        if (inputRow) {
            inputRow.style.display = isVisible ? "flex" : "none";
        }
        if (taskList) {
            taskList.style.display = isVisible ? "block" : "none";
        }
        if (input) {
            input.disabled = !isVisible;
        }
        if (addBtn) {
            addBtn.disabled = !isVisible;
        }
    }

    function renderTasks() {
        if (!taskList) {
            return;
        }

        taskList.innerHTML = "";

        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            if (task.completed) {
                li.classList.add("completed");
            }

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.addEventListener("change", () => {
                tasks[index].completed = checkbox.checked;
                renderTasks();
            });

            const span = document.createElement("span");
            span.textContent = task.text;

            const updateBtn = document.createElement("button");
            updateBtn.className = "update-btn";
            updateBtn.textContent = "Update";
            updateBtn.addEventListener("click", () => {
                const updatedText = prompt("Update task", task.text);
                if (updatedText !== null) {
                    const trimmedText = updatedText.trim();
                    if (trimmedText) {
                        tasks[index].text = trimmedText;
                        renderTasks();
                    }
                }
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", () => {
                tasks.splice(index, 1);
                renderTasks();
            });

            li.append(checkbox, span, updateBtn, deleteBtn);
            taskList.appendChild(li);
        });
    }

    function addTask() {
        if (!input) {
            return;
        }

        const value = input.value.trim();

        if (!value) {
            input.focus();
            return;
        }

        tasks.push({ text: value, completed: false });
        input.value = "";
        renderTasks();
    }

    function showTodoView() {
        const authContainer = document.getElementById("authContainer");
        if (!authContainer) {
            return;
        }

        authContainer.innerHTML = "";
        const welcome = document.createElement("p");
        welcome.className = "welcome";
        welcome.textContent = `Welcome, ${window.app.currentUser}!`;
        authContainer.appendChild(welcome);

        setTodoVisibility(true);
        renderTasks();
    }

    setTodoVisibility(false);

    if (addBtn) {
        addBtn.addEventListener("click", addTask);
    }

    if (input) {
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                addTask();
            }
        });
    }

    window.app.showTodoView = showTodoView;
    window.app.setTodoVisibility = setTodoVisibility;
    window.app.renderTasks = renderTasks;
})();