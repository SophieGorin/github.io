// register.js
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const password = document.getElementById('password').value;

    // Проверяем, что все поля заполнены
    if (email && firstName && lastName && password) {
        // Сохраняем данные пользователя в localStorage
        localStorage.setItem('user', JSON.stringify({
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: password
        }));

        // Перенаправляем на страницу входа после регистрации
        window.location.href = 'login.html';
    } else {
        alert('Пожалуйста, заполните все поля.');
    }
});
