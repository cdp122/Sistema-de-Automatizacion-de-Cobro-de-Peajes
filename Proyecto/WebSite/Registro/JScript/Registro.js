document.addEventListener('DOMContentLoaded', () => {
    const placaInput = document.getElementById('placa');

    // Convertir el campo de placa a mayúsculas en tiempo real y limitar a 7 caracteres
    placaInput.addEventListener('input', (event) => {
        const input = event.target;
        input.value = input.value.toUpperCase();
    });

    // Limitar el número de caracteres a 7
    placaInput.addEventListener('keypress', (event) => {
        if (placaInput.value.length >= 7) {
            event.preventDefault();
        }
    });

    // Validar que la placa sea alfanumérica y tenga 6 o 7 caracteres
    placaInput.addEventListener('input', (event) => {
        const input = event.target;
        const placaPattern = /^[A-Z0-9]{6,7}$/;
        if (!placaPattern.test(input.value)) {
            input.setCustomValidity('Placa inválida. Debe tener 6 o 7 caracteres alfanuméricos.');
        } else {
            input.setCustomValidity('');
        }
    });
});

function limpiarErrores() {
    const errores = document.querySelectorAll('.error');
    errores.forEach((error) => {
        error.textContent = '';
    });
}

async function validarFormulario(event) {
    event.preventDefault();
    limpiarErrores();

    const form = document.getElementById('registroForm');
    const nombre = form.nombre.value;
    const apellido = form.apellido.value;
    const cedula = form.cedula.value;
    const fechaNacimiento = form.fechaNacimiento.value;
    const email = form.email.value.toLowerCase();
    const password = form.password.value;
    const confirmacionPasswd = form.confirmacionPasswd.value;
    const telefono = form.telefono.value;
    const modeloVehiculo = form.modeloVehiculo.value;
    const color = form.color.value;
    const tipoVehiculo = form.tipoVehiculo.value;
    const placa = form.placa.value;
    var validado = true;

    // Validar nombre
    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{1,25}$/;
    if (!nombreRegex.test(nombre)) {
        document.getElementById('nombreError').textContent = 'Nombre inválido. Solo letras y espacios, hasta 25 caracteres.';
        validado = false;
    }

    // Validar apellido
    const apellidoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{1,25}$/;
    if (!apellidoRegex.test(apellido)) {
        document.getElementById('apellidoError').textContent = 'Apellido inválido. Solo letras y espacios, hasta 25 caracteres.';
        validado = false;
    }

    // Validar cédula
    const cedulaRegex = /^\d{10}$/;
    if (!cedulaRegex.test(cedula)) {
        document.getElementById('cedulaError').textContent = 'Cédula inválida. Debe tener 10 dígitos.';
        validado = false;
    }

    // Validar fecha de nacimiento
    const fechaNacimientoDate = new Date(fechaNacimiento);
    const fechaActual = new Date();
    const fechaMinima = new Date();
    fechaMinima.setFullYear(fechaMinima.getFullYear() - 100);
    const edadMinima = new Date();
    edadMinima.setFullYear(fechaActual.getFullYear() - 18);

    if (fechaNacimientoDate > fechaActual || fechaNacimientoDate < fechaMinima || fechaNacimientoDate > edadMinima) {
        document.getElementById('fechaNacimientoError').textContent = 'Fecha de nacimiento inválida. Debe ser mayor de 18 años.';
        validado = false;
    }

    // Validar correo electrónico
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(email)) {
        document.getElementById('emailError').textContent = 'Correo electrónico inválido.';
        validado = false;
    }

    // Validar contraseña
    if (password.length < 8) {
        document.getElementById('passwordError').textContent = 'La contraseña debe tener al menos 8 caracteres.';
        validado = false;
    }

    // Confirmar contraseña
    if (password !== confirmacionPasswd) {
        document.getElementById('confirmacionPasswdError').textContent = 'Las contraseñas no coinciden.';
        validado = false;
    }

    // Validar teléfono
    const telefonoRegex = /^\d{10}$/;
    if (!telefonoRegex.test(telefono)) {
        document.getElementById('telefonoError').textContent = 'Número de teléfono inválido. Debe tener 10 dígitos.';
        validado = false;
    }

    // Validar placa
    const placaRegex = /^[A-Za-z0-9]{6,7}$/;
    if (!placaRegex.test(placa)) {
        document.getElementById('placaError').textContent = 'Placa inválida. Debe tener 6 o 7 caracteres alfanuméricos.';
        validado = false;
    }

    if (validado) {
        await CrearCuenta();
    }
}

function mostrarOcultarContraseña() {
    const password = document.getElementById("password");
    const confirmacionPasswd = document.getElementById("confirmacionPasswd");
    if (password.type === "password" || confirmacionPasswd.type === "password") {
        password.type = "text";
        confirmacionPasswd.type = "text";
    } else {
        password.type = "password";
        confirmacionPasswd.type = "password";
    }
}
//#region Backend
async function CrearCuenta() {
    event.preventDefault();

    const data = {
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        cedula: document.getElementById("cedula").value,
        fecha: document.getElementById("fechaNacimiento").value,
        correo: document.getElementById("email").value,
        contraseña: document.getElementById("password").value,
        telefono: document.getElementById("telefono").value,
        modelo: document.getElementById("modeloVehiculo").value,
        tipoVehiculo: document.getElementById("tipoVehiculo").value,
        color: document.getElementById("color").value,
        placa: document.getElementById("placa").value
    }

    try {
        const response = await fetch("/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            if (result == "ok") {
                alert("Usuario creado correctamente con el ID C" + data.cedula) //Cambiar aqui lo que quiere que haga
                window.location.href = "../../LogIn/html/Login.html";
            }
            else {
                alert(result);
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