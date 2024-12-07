// profile.js
window.onload = function() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user) {
        // Заполняем профиль данными пользователя
        document.getElementById('profileEmail').textContent = user.email;
        document.getElementById('profileFirstName').textContent = user.firstName;
        document.getElementById('profileLastName').textContent = user.lastName;
    } else {
        // Перенаправляем на страницу регистрации, если пользователь не авторизован
        window.location.href = 'index.html';
    }

    // Создание конференции
    document.getElementById('createConferenceButton').addEventListener('click', function() {
        const conferenceId = Math.floor(Math.random() * 1000000); // Генерация случайного ID конференции
        localStorage.setItem('conferenceId', conferenceId);
        window.location.href = `conference.html?id=${conferenceId}`;
    });

    // Присоединение к конференции
    document.getElementById('joinConferenceForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const conferenceId = document.getElementById('conferenceId').value;
        
        if (conferenceId) {
            localStorage.setItem('conferenceId', conferenceId);
            window.location.href = `conference.html?id=${conferenceId}`;
        } else {
            alert('Введите ID конференции');
        }
    });
};
