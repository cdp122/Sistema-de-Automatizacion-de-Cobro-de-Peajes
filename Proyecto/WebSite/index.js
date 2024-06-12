document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.querySelector('.navbar');

    menuToggle.addEventListener('change', function() {
      if (menuToggle.checked) {
        navbar.classList.add('mostrar-menu');
      } else {
        navbar.classList.remove('mostrar-menu');
      }
    });
  });