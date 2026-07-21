(function() {
    "use strict";

    const loginView = document.getElementById("loginView");
    const registerView = document.getElementById("registerView");
    const todoView = document.getElementById("todoView");
    const loginForm = document.getElementById("loginForm");
    const showRegisterBtn = document.getElementById("showRegisterBtn");

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

    function showAuthView(view) {
        if (loginView) {
            loginView.hidden = view !== "login";
        }
        if (registerView) {
            registerView.hidden = view !== "register";
        }
        if (todoView) {
            todoView.hidden = view !== "todo";
        }
    }

    function showLoginView() {
        showAuthView("login");
        const usernameInput = document.getElementById("username");
        if (usernameInput) {
            usernameInput.focus();
        }
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!username || !password) {
                alert("Please enter both your username and password.");
                return;
            }

            const storedUsers = getStoredUsers();
            const storedUser = storedUsers[username];

            if (!storedUser || storedUser.password !== password) {
                alert("Invalid username or password.");
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
    }

    if (showRegisterBtn) {
        showRegisterBtn.addEventListener("click", () => {
            if (window.app && typeof window.app.showRegistrationView === "function") {
                window.app.showRegistrationView();
            }
        });
    }

    window.app = window.app || {};
    window.app.showLoginView = showLoginView;
    showLoginView();
})();