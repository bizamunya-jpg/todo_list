(function() {
    "use strict";

    const input = document.getElementById("taskinput");
    const addBtn = document.getElementById("addBtn");
    const taskList = document.getElementById("tasklist");
    const tasks = [];

    function renderTasks() {
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
        const value = input.value.trim();

        if (!value) {
            input.focus();
            return;
        }

        tasks.push({ text: value, completed: false });
        input.value = "";
        renderTasks();
    }

    addBtn.addEventListener("click", addTask);

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            addTask();
        }
    });

    renderTasks();
})();