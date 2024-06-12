document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.querySelector('.navbar');

    menuToggle.addEventListener('change', function () {
        if (menuToggle.checked) {
            navbar.classList.add('mostrar-menu');
        } else {
            navbar.classList.remove('mostrar-menu');
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const despDiv = document.querySelector(".Desp");
    const navLinks = document.querySelectorAll(".navDes a");

    menuToggle.addEventListener("change", () => {
        if (menuToggle.checked) {
            despDiv.style.display = "block";
        } else {
            despDiv.style.display = "none";
        }
    });

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            menuToggle.checked = false;
            despDiv.style.display = "none";
        });
    });
});

