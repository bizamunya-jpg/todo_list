(function() {
    "use strict";

    const loginView = document.getElementById("loginView");
    const registerView = document.getElementById("registerView");
    const todoView = document.getElementById("todoView");
    const registerForm = document.getElementById("registerForm");
    const backToLoginBtn = document.getElementById("backToLoginBtn");

    function getStoredUsers() {
        if (typeof window.localStorage === "undefined") {
            return {};
        }

        try {
            const storedUsers = window.localStorage.getItem("todoUsers");
            return storedUsers ? JSON.parse(storedUsers) : {};
        } catch (error) {
            console.error("Unable to read stored users", error);
            return {};
        }
    }

    function saveUsers(users) {
        if (typeof window.localStorage !== "undefined") {
            window.localStorage.setItem("todoUsers", JSON.stringify(users));
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showRegistrationView() {
        if (loginView) {
            loginView.hidden = true;
        }
        if (registerView) {
            registerView.hidden = false;
        }
        if (todoView) {
            todoView.hidden = true;
        }
        const emailInput = document.getElementById("email");
        if (emailInput) {
            emailInput.focus();
        }
    }

    if (registerForm) {
        registerForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const username = document.getElementById("regUsername").value.trim();
            const password = document.getElementById("regPassword").value.trim();

            if (!email || !username || !password) {
                alert("Please fill in all registration fields.");
                return;
            }

            if (!isValidEmail(email)) {
                alert("Please enter a valid email address in the format example@example.com.");
                return;
            }

            const storedUsers = getStoredUsers();
            if (storedUsers[username]) {
                alert("That username is already taken.");
                return;
            }

            storedUsers[username] = { email, password };
            saveUsers(storedUsers);

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
    }

    if (backToLoginBtn) {
        backToLoginBtn.addEventListener("click", () => {
            if (window.app && typeof window.app.showLoginView === "function") {
                window.app.showLoginView();
            }
        });
    }

    window.app = window.app || {};
    window.app.showRegistrationView = showRegistrationView;
})();