(function() {
    "use strict";

    const authContainer = document.getElementById("authContainer");

    function showLoginView() {
        if (!authContainer) {
            return;
        }

        authContainer.innerHTML = "";

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

            if (window.app && typeof window.app.showTodoView === "function") {
                window.app.currentUser = username;
                window.app.showTodoView();
            }
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
        registerBtn.textContent = "Create account";
        registerBtn.addEventListener("click", () => {
            if (window.app && typeof window.app.showRegistrationView === "function") {
                window.app.showRegistrationView();
            }
        });

        form.append(usernameLabel, usernameInput, passwordLabel, passwordInput, submitBtn);
        authContainer.append(heading, form, registerBtn);
    }

    window.app = window.app || {};
    window.app.showLoginView = showLoginView;
})();
