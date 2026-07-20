(function() {
    "use strict";

    const input = document.getElementById("taskinput");
    const addBtn = document.getElementById("addBtn");
    const taskList = document.getElementById("tasklist");
    const inputRow = document.querySelector(".input-row");
    const tasks = [];
    let currentUser = "";

    showLoginView();

    function showLoginView() {
        if (!authContainer) {
            return;
        }

        authContainer.innerHTML = "";
        setTodoVisibility(false);

        const heading = document.createElement("h2");
        heading.textContent = "Login";

        const form = document.createElement("form");
        form.className = "auth-form";
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const username = form.querySelector("#username").value.trim();
            const password = form.querySelector("#password").value.trim();

            if (!username || !password) {
                alert("Please enter both your username and password.");
                return;
            }

            currentUser = username;
            showTodoView();
        });

        const usernameLabel = document.createElement("label");
        usernameLabel.textContent = "Username";
        usernameLabel.setAttribute("for", "username");

        const usernameInput = document.createElement("input");
        usernameInput.type = "text";
        usernameInput.id = "username";
        usernameInput.name = "username";
        usernameInput.required = true;

        const passwordLabel = document.createElement("label");
        passwordLabel.textContent = "Password";
        passwordLabel.setAttribute("for", "password");

        const passwordInput = document.createElement("input");
        passwordInput.type = "password";
        passwordInput.id = "password";
        passwordInput.name = "password";
        passwordInput.required = true;

        const submitBtn = document.createElement("button");
        submitBtn.type = "submit";
        submitBtn.textContent = "Log in";

        const registerBtn = document.createElement("button");
        registerBtn.type = "button";
        registerBtn.className = "register-btn";
        registerBtn.textContent = "Register";

        const registerText = document.createElement("p");
        registerText.className = "register-text";
        registerText.textContent = "Don't have an account register now?";

        form.append(usernameLabel, usernameInput, passwordLabel, passwordInput, submitBtn);
        authContainer.append(heading, form, registerText, registerBtn);
    }

    function showTodoView() {
        if (!authContainer) {
            return;
        }

        authContainer.innerHTML = "";
        const welcome = document.createElement("p");
        welcome.className = "welcome";
        welcome.textContent = `Welcome, ${currentUser}!`;
        authContainer.appendChild(welcome);

        setTodoVisibility(true);
        renderTasks();
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
})();