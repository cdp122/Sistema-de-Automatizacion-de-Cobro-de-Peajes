
function validateInput(input) {
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, 10);
}

function setBackgroundBasedOnTime() {
    var hour = new Date().getHours();
    var body = document.body;
    var fullSection = document.querySelector('.full');
    var contentSection = document.querySelector('.content');
    var butonSection = document.querySelector('.btn');

    if (hour >= 6 && hour < 18) {
        fullSection.className = 'full day';
    } else {
        fullSection.className = 'full night';
        contentSection.className = 'content contentNight';
        butonSection.className = 'btn btnNight';
    }
}

setBackgroundBasedOnTime();
    