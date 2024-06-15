document.addEventListener("DOMContentLoaded", function () {
    const camposEditables = ["telefono", "direccion", "email"];
    const editarPerfilBtn = document.getElementById("editar-perfil");
    const guardarCambiosBtn = document.getElementById("guardar-cambios");

    function editarPerfil() {
        camposEditables.forEach(id => {
            const campo = document.getElementById(id);
            campo.setAttribute("contenteditable", "true");
            campo.classList.add("editable");
            campo.addEventListener("focus", limpiarCampo);
            campo.addEventListener("blur", restaurarCampo);
        });
        editarPerfilBtn.style.display = "none";
        guardarCambiosBtn.style.display = "block";
    }

    function guardarCambios() {
        let cedula = document.getElementById("cedula").textContent;

        if (!/^\d{10}$/.test(cedula)) {
            alert("La cédula debe contener 10 dígitos y solo números.");
            return;
        }

        camposEditables.forEach(id => {
            const campo = document.getElementById(id);
            campo.setAttribute("contenteditable", "false");
            campo.classList.remove("editable");
            campo.removeEventListener("focus", limpiarCampo);
            campo.removeEventListener("blur", restaurarCampo);
        });

        // Aquí se puede agregar el código para enviar los datos al servidor
        alert("Cambios guardados exitosamente.");

        editarPerfilBtn.style.display = "block";
        guardarCambiosBtn.style.display = "none";
    }

    function limpiarCampo(event) {
        if (event.target.textContent === event.target.defaultValue) {
            event.target.textContent = "";
        }
    }

    function restaurarCampo(event) {
        if (event.target.textContent === "") {
            event.target.textContent = event.target.defaultValue;
        }
    }

    editarPerfilBtn.addEventListener("click", editarPerfil);
    guardarCambiosBtn.addEventListener("click", guardarCambios);
});

function recargarSaldo() {
    let balanceElement = document.getElementById("balance-amount");
    let saldoActual = parseFloat(balanceElement.textContent.replace('$', ''));
    let nuevoSaldo = prompt("Ingrese el monto a recargar:");
    let actualizacionSaldo = parseFloat(saldoActual) + parseFloat(nuevoSaldo);
    console.log(actualizacionSaldo);

    if (nuevoSaldo !== null && !isNaN(nuevoSaldo) && nuevoSaldo > 0 && actualizacionSaldo <= 99.99) {
        saldoActual = parseFloat(balanceElement.textContent.replace('$', ''));
        let saldoNuevo = saldoActual + parseFloat(nuevoSaldo);
        balanceElement.textContent = `$${saldoNuevo.toFixed(2)}`;
    }
    else if (actualizacionSaldo > 99.99) {
        alert("No se permite exceder la cantidad de Saldo de 99.99$");
    }
    else {
        alert("Ingrese un monto válido.");
    }
}

function regresarMenu() {
    window.location.href = "menu.html"; // Cambia "menu.html" por la URL correcta de tu menú principal
}
