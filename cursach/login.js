// login.js
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const loginEmail = document.getElementById('loginEmail').value;
    const loginPassword = document.getElementById('loginPassword').value;

    const storedUser = JSON.parse(localStorage.getItem('user'));

    // Проверяем, что пользователь существует и пароль правильный
    if (storedUser && loginEmail === storedUser.email && loginPassword === storedUser.password) {
        // Если вход успешен, перенаправляем на страницу профиля
        window.location.href = 'profile.html';
    } else {
        alert('Неверный email или пароль');
    }
});
