function validarFormulario() {
    const form = document.getElementById('registroForm');
    const nombre = form.nombre.value;
    const apellido = form.apellido.value;
    const email = form.email.value;
    const password = form.password.value;
    const telefono = form.telefono.value;
    const modeloVehiculo = form.modeloVehiculo.value;
    const tipoVehiculo = form.tipoVehiculo.value;
    const placa = form.placa.value;

    // Validar que los campos no estén vacíos
    if (!nombre || !apellido || !email || !password || !telefono || !modeloVehiculo || !tipoVehiculo || !placa) {
        alert('Todos los campos son obligatorios.');
        return false;
    }

    // Validar nombre y apellido
    const nombreApellidoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/;
    if (!nombreApellidoRegex.test(nombre) || !nombreApellidoRegex.test(apellido)) {
        alert('Nombre y Apellido deben contener solo letras y espacios, mínimo 2 caracteres.');
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
