(function() {
    "use strict";

    const input = document.getElementById("taskinput");
    const addBtn = document.getElementById("addBtn");
    const taskList = document.getElementById("tasklist");
    const inputRow = document.querySelector(".input-row");
    const welcomeMessage = document.getElementById("welcomeMessage");
    const loginView = document.getElementById("loginView");
    const registerView = document.getElementById("registerView");
    const todoView = document.getElementById("todoView");
    const tasks = [];
    const storageKeys = {
        tasks: "todoTasks",
        currentUser: "todoCurrentUser",
        accessToken: "todoAccessToken"
    };

    window.app = window.app || {};
    window.app.currentUser = "";
    window.app.tasks = tasks;

    function setAccessToken(token) {
        window.app.accessToken = token;
        if (typeof window.localStorage !== "undefined") {
            if (token) {
                window.localStorage.setItem(storageKeys.accessToken, token);
            } else {
                window.localStorage.removeItem(storageKeys.accessToken);
            }
        }
    }

    function setCurrentUser(username) {
        window.app.currentUser = username || "";
        if (typeof window.localStorage !== "undefined") {
            if (window.app.currentUser) {
                window.localStorage.setItem(storageKeys.currentUser, window.app.currentUser);
            } else {
                window.localStorage.removeItem(storageKeys.currentUser);
            }
        }
    }

    function saveTasks() {
        if (typeof window.localStorage !== "undefined") {
            try {
                window.localStorage.setItem(storageKeys.tasks, JSON.stringify(tasks));
            } catch (error) {
                console.error("Unable to save tasks", error);
            }
        }
    }

    function loadTasks() {
        if (typeof window.localStorage !== "undefined") {
            try {
                const storedTasks = window.localStorage.getItem(storageKeys.tasks);
                if (storedTasks) {
                    const parsedTasks = JSON.parse(storedTasks);
                    if (Array.isArray(parsedTasks)) {
                        tasks.splice(0, tasks.length, ...parsedTasks);
                    }
                }
            } catch (error) {
                console.error("Unable to load tasks", error);
            }
        }
    }

    function restoreSession() {
        if (typeof window.localStorage !== "undefined") {
            const storedUser = window.localStorage.getItem(storageKeys.currentUser);
            if (storedUser) {
                window.app.currentUser = storedUser;
            }
        }
        loadTasks();
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

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

        taskList.innerHTML = tasks.map((task, index) => `
            <li class="${task.completed ? "completed" : ""}">
                <input type="checkbox" class="task-checkbox" data-index="${index}" ${task.completed ? "checked" : ""}>
                <span>${escapeHtml(task.text)}</span>
                <button type="button" class="update-btn" data-action="update" data-index="${index}">Update</button>
                <button type="button" class="delete-btn" data-action="delete" data-index="${index}">Delete</button>
            </li>
        `).join("");
    }

    function handleTaskChange(event) {
        const checkbox = event.target.closest(".task-checkbox");
        if (!checkbox) {
            return;
        }

        const index = Number(checkbox.dataset.index);
        if (!Number.isNaN(index) && tasks[index]) {
            tasks[index].completed = checkbox.checked;
            saveTasks();
            renderTasks();
        }
    }

    function handleTaskClick(event) {
        const button = event.target.closest("button[data-action]");
        if (!button) {
            return;
        }

        const index = Number(button.dataset.index);
        if (Number.isNaN(index) || !tasks[index]) {
            return;
        }

        if (button.dataset.action === "delete") {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        }

        if (button.dataset.action === "update") {
            const updatedText = prompt("Update task", tasks[index].text);
            if (updatedText !== null) {
                const trimmedText = updatedText.trim();
                if (trimmedText) {
                    tasks[index].text = trimmedText;
                    saveTasks();
                    renderTasks();
                }
            }
        }
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
        saveTasks();
        input.value = "";
        renderTasks();
    }

    function showTodoView() {
        if (loginView) {
            loginView.hidden = true;
        }
        if (registerView) {
            registerView.hidden = true;
        }
        if (todoView) {
            todoView.hidden = false;
        }
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome, ${window.app.currentUser}!`;
        }

        setTodoVisibility(true);
        renderTasks();
    }

    restoreSession();
    setTodoVisibility(false);

    if (taskList) {
        taskList.addEventListener("change", handleTaskChange);
        taskList.addEventListener("click", handleTaskClick);
    }

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
    window.app.setAccessToken = setAccessToken;
    window.app.setCurrentUser = setCurrentUser;
})();