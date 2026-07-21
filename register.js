(function() {
    "use strict";

    const authContainer = document.getElementById("authContainer");

    function showRegistrationView() {
        if (!authContainer) {
            return;
        }

        authContainer.innerHTML = "";

        const heading = document.createElement("h2");
        heading.textContent = "Register";

        const form = document.createElement("form");
        form.className = "auth-form";
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const email = form.querySelector("#email").value.trim();
            const username = form.querySelector("#regUsername").value.trim();
            const password = form.querySelector("#regPassword").value.trim();

            if (!email || !username || !password) {
                alert("Please fill in all registration fields.");
                return;
            }

            if (window.app && typeof window.app.showTodoView === "function") {
                if (typeof window.app.setCurrentUser === "function") {
                    window.app.setCurrentUser(username);
                } else {
                    window.app.currentUser = username;
                }
                const token = `token-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
                window.app.accessToken = token;
                if (typeof window.localStorage !== "undefined") {
                    window.localStorage.setItem("todoAccessToken", token);
                }
                if (typeof window.app.setAccessToken === "function") {
                    window.app.setAccessToken(token);
                }
                window.app.showTodoView();
            }
        });

        const emailLabel = document.createElement("label");
        emailLabel.textContent = "Email";
        emailLabel.setAttribute("for", "email");

        const emailInput = document.createElement("input");
        emailInput.type = "text";
        emailInput.id = "email";
        emailInput.name = "email";
        emailInput.required = true;

        const usernameLabel = document.createElement("label");
        usernameLabel.textContent = "Username";
        usernameLabel.setAttribute("for", "regUsername");

        const usernameInput = document.createElement("input");
        usernameInput.type = "text";
        usernameInput.id = "regUsername";
        usernameInput.name = "regUsername";
        usernameInput.required = true;

        const passwordLabel = document.createElement("label");
        passwordLabel.textContent = "Password";
        passwordLabel.setAttribute("for", "regPassword");

        const passwordInput = document.createElement("input");
        passwordInput.type = "password";
        passwordInput.id = "regPassword";
        passwordInput.name = "regPassword";
        passwordInput.required = true;

        const submitBtn = document.createElement("button");
        submitBtn.type = "submit";
        submitBtn.textContent = "Register";

        const backBtn = document.createElement("button");
        backBtn.type = "button";
        backBtn.textContent = "Back to login";
        backBtn.addEventListener("click", () => {
            if (window.app && typeof window.app.showLoginView === "function") {
                window.app.showLoginView();
            }
        });

        form.append(emailLabel, emailInput, usernameLabel, usernameInput, passwordLabel, passwordInput, submitBtn);
        authContainer.append(heading, form, backBtn);
    }

    window.app = window.app || {};
    window.app.showRegistrationView = showRegistrationView;
})();