document.addEventListener('DOMContentLoaded', function () {
    const botonesRegreso = document.querySelectorAll('.boton-regreso');

    botonesRegreso.forEach(boton => {
        boton.addEventListener('click', function (event) {
            event.preventDefault();
            const url = this.getAttribute('href');
            window.location.href = url;
        });
    });
});
