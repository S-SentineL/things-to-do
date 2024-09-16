document.addEventListener('DOMContentLoaded', function() {
    const logindiv = document.getElementById('logindiv');
    const registerdiv = document.getElementById('registerdiv');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');

    if (logindiv && registerdiv && showRegister && showLogin) {
        showRegister.addEventListener('click', function(event) {
            event.preventDefault(); 
            logindiv.style.display = 'none';
            registerdiv.style.display = 'block';
        });

        showLogin.addEventListener('click', function(event) {
            event.preventDefault(); 
            registerdiv.style.display = 'none';
            logindiv.style.display = 'block';
        });
    }

    if (loginButton) {
        loginButton.addEventListener('click', function() {
            window.location.href = '../pages/list.html';
        });
    }

    if (registerButton) {
        registerButton.addEventListener('click', function(event) {
            event.preventDefault(); 
            registerdiv.style.display = 'none';
            logindiv.style.display = 'block';
        });
    }


    document.getElementById('register-pass-img').addEventListener('click', function() {
        showPass('register-password', this);
    });

    document.getElementById('confirm-pass-img').addEventListener('click', function() {
        showPass('confirmpassword', this);
    });

    function showPass(passwordInputId, icon) {
        const passwordInput = document.getElementById(passwordInputId);
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.src = '../assets/password_hide_eye.png';
        } else {
            passwordInput.type = 'password';
            icon.src = '../assets/password_show_eye.png';
        }
    }


    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            if (getComputedStyle(logindiv).display === 'block') {
                loginButton.click();
            } else if (getComputedStyle(registerdiv).display === 'block') {
                registerButton.click(); 
            }
        }
    });
});
