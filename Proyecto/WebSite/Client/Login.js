function validateInput(input) {
    //input.value = input.value.replace(/[^0-9]/g, '').slice(0, 11);
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

async function Validar() {
    event.preventDefault();

    const user = document.getElementById("username").value.toUpperCase();
    const contraseña = document.getElementById("password").value;

    try {
        let response;
        if (user[0] === "C") {
            response = await fetch("http://localhost:3000/login/authclient?username=" + encodeURIComponent(user) + "&password=" + encodeURIComponent(contraseña), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else if (user[0] === "E") {
            response = await fetch("/login/authemployee?username=" + encodeURIComponent(user) + "&password=" + encodeURIComponent(contraseña), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            alert("Credenciales incorrectas, intente de nuevo por favor.");
            return;
        }

        if (response.ok) {
            const result = await response.json();

            if (result.tipo === "Cliente") {
                localStorage.setItem('token', result.token);
                window.location.href = "./Profile.html";
            } else if (result.tipo === "Empleado") {
                alert("Estamos trabajando en la página de Empleados. Así que aún no es accesible...");
            } else {
                alert("Tipo de usuario desconocido: " + result.tipo);
            }
        } else {
            const errorResult = await response.json();
            alert(errorResult.message || "Error desconocido");
        }
    } catch (error) {
        console.error(error);
        alert("Error: " + error.message);
    }
}