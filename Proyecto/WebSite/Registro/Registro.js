function validarFormulario() {
    const form = document.getElementById('registroForm');
    const nombre = form.nombre.value;
    const cedula = form.cedula.value;
    const fechaNacimiento = form.fechaNacimiento.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmacionPasswd = form.confirmacionPasswd.value;
    const telefono = form.telefono.value;
    const modeloVehiculo = form.modeloVehiculo.value;
    const color = form.color.value;
    const tipoVehiculo = form.tipoVehiculo.value;
    const placa = form.placa.value;

    // Validar que los campos no estén vacíos
    if (!nombre || !cedula || !fechaNacimiento || !email || !password || !confirmacionPasswd || !telefono || !modeloVehiculo || !color || !tipoVehiculo || !placa) {
        alert('Todos los campos son obligatorios.');
        return false;
    }

    // Validar nombre
    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{1,50}$/;
    if (!nombreRegex.test(nombre)) {
        alert('Nombre y Apellidos deben contener solo letras y espacios, máximo 50 caracteres.');
        return false;
    }

    // Validar cédula
    const cedulaRegex = /^\d{10}$/;
    if (!cedulaRegex.test(cedula)) {
        alert('Por favor, ingrese una cédula válida (10 dígitos numéricos).');
        return false;
    }

    // Validar fecha de nacimiento
    const fechaNacimientoDate = new Date(fechaNacimiento);
    const fechaActual = new Date();
    const fechaMinima = new Date();
    fechaMinima.setFullYear(fechaMinima.getFullYear() - 100);
    if (fechaNacimientoDate > fechaActual || fechaNacimientoDate < fechaMinima) {
        alert('Por favor, ingrese una fecha de nacimiento válida.');
        return false;
    }

    // Validar correo electrónico
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, ingrese un correo electrónico válido.');
        return false;
    }

    // Validar contraseña
    if (password.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres.');
        return false;
    }

    // Confirmar contraseña
    if (password !== confirmacionPasswd) {
        alert('Las contraseñas no coinciden.');
        return false;
    }

    // Validar teléfono
    const telefonoRegex = /^\d{10}$/;
    if (!telefonoRegex.test(telefono)) {
        alert('Por favor, ingrese un número de teléfono válido (10 dígitos).');
        return false;
    }

    // Validar placa
    const placaRegex = /^[A-Za-z0-9]{6,7}$/;
    if (!placaRegex.test(placa)) {
        alert('Por favor, ingrese una placa válida (6 o 7 caracteres alfanuméricos).');
        return false;
    }

    // Si todo es válido
    alert('Registro exitoso');
    return true;
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

async function CrearCuenta() {
    event.preventDefault();

    const data = {
        nombres: document.getElementById("nombre").value,
        cedula: document.getElementById("cedula").value,
        fecha: document.getElementById("fechaNacimiento").value,
        correo: document.getElementById("email").value,
        contraseña: document.getElementById("password").value,
        telefono: document.getElementById("telefono").value,
        modelo: document.getElementById("modeloVehiculo").value,
        tipoVehiculo: document.getElementById("tipoVehiculo").value,
        placa: document.getElementById("placa").value
    }

    console.log(data);

    try {
        response = await fetch("/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Usuario creado correctamente con el ID C" + data.cedula) //Cambiar aqui lo que quiere que haga
            window.location.href = "../LogIn/Login.html";
        } else {
            const errorResult = await response.json();
            alert(errorResult.message || "Error desconocido");
        }
    } catch (error) {
        console.error(error);
        alert("Error: " + error.message);
    }
}