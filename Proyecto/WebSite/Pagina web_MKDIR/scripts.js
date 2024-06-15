document.addEventListener('DOMContentLoaded', (event) => {
    const form = document.querySelector('form');
    const redirectButton = document.querySelector('.redirect-button');

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('Formulario enviado correctamente.');
            form.submit();
        });
    }

    if (redirectButton) {
        redirectButton.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = 'telepass.html';
        });
    }
});
