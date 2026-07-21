(function() {
    "use strict";

    const input = document.getElementById("taskinput");
    const addBtn = document.getElementById("addBtn");
    const taskList = document.getElementById("tasklist");
    const inputRow = document.querySelector(".input-row");
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
                saveTasks();
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
                        saveTasks();
                        renderTasks();
                    }
                }
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", () => {
                tasks.splice(index, 1);
                saveTasks();
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
        saveTasks();
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

    restoreSession();
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
    window.app.setAccessToken = setAccessToken;
    window.app.setCurrentUser = setCurrentUser;
})();