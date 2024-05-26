
function validateInput(input) {
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, 10);
}

function setBackgroundBasedOnTime() {
    var hour = new Date().getHours();
    var fullSection = document.querySelector('.full');
    var contentSection = document.querySelector('.content');
    var buttonSection = document.querySelector('.btn');
    var usernameInput = document.querySelector('.username');
    var passwordInput = document.querySelector('.contraseña');

    if (hour >= 6 && hour < 18) {
        fullSection.className = 'full day';
    } else {
        fullSection.className = 'full night';
        contentSection.className = 'content contentNight';
        buttonSection.className = 'btn btnNight';
        usernameInput.className = 'username usernameNight';
        passwordInput.className = 'contraseña contraseñaNight';
    }
}

setBackgroundBasedOnTime();
    