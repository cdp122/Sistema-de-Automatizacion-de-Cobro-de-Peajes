var token;
const camposEditables = ["cedula", "telefono", "modelo-carro", "placa", "codigo-telepass", "email"];
const editarPerfilBtn = document.getElementById("editar-perfil");
const guardarCambiosBtn = document.getElementById("guardar-cambios");

document.addEventListener("DOMContentLoaded", function () {
    Validar();
});

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
    let telefono = document.getElementById("telefono").textContent;
    let placa = document.getElementById("placa").textContent;
    let tarjeta = document.getElementById("codigo-telepass").textContent;
    let correo = document.getElementById("email").textContent.toLowerCase();
    document.getElementById("email").textContent = correo;

    let guardar = true;

    if (!/^\d{10}$/.test(cedula)) {
        alert("La cédula debe contener 10 dígitos y solo números.");
        guardar = false;
    }

    if (!/^\d{10}$/.test(telefono)) {
        alert("El nro de Telefono debe contener 10 dígitos y solo números.");
        guardar = false;
    }

    if (!/^[A-Z]{3}[0-9]{4}$/.test(placa)) {
        alert("La placa no corresponde al formato XXX####.");
        guardar = false;
    }

    if (!/^\d{5}$/.test(tarjeta)) {
        alert("La tarjeta debe contener 5 dígitos y solo números.");
        guardar = false;
    }

    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(correo)) {
        alert("Correo Inválido.");
        guardar = false;
    }

    if (guardar && ActualizarDatos()) {
        camposEditables.forEach(id => {
            const campo = document.getElementById(id);
            campo.setAttribute("contenteditable", "false");
            campo.classList.remove("editable");
            campo.removeEventListener("focus", limpiarCampo);
            campo.removeEventListener("blur", restaurarCampo);
        });

        alert("Cambios guardados exitosamente.");
        editarPerfilBtn.style.display = "block";
        guardarCambiosBtn.style.display = "none";
    }
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
    else if (actualizacionSaldo >= 100) {
        alert("No se permite exceder la cantidad de Saldo de 99.99$");
    }
    else {
        alert("Ingrese un monto válido.");
    }
}

async function Validar() {
    token = localStorage.getItem('token');

    try {
        const response = await fetch("/clientes", {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        });
        if (response.ok) {
            const data = await response.json();
            if (data.message) window.location.href = "../Error/PagError404.html";

            document.getElementById("full-name").innerHTML = data.nombre;
            document.getElementById("balance-amount").innerHTML = "$" + parseFloat(data.saldo);
            document.getElementById("cedula").innerHTML = data.cedula;
            document.getElementById("telefono").innerHTML = data.telefono;
            document.getElementById("modelo-carro").innerHTML = data.modelo;
            document.getElementById("placa").innerHTML = data.placa;
            document.getElementById("codigo-telepass").innerHTML = data.tarjeta;
            document.getElementById("email").innerHTML = data.correo;
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function CerrarSesion() {
    try {
        const response = await fetch('/login/close', {
            method: 'DELETE',
            headers: {
                'Authorization': token
            }
        });
        if (response.ok) {
            localStorage.removeItem('token'); // Eliminar el token del almacenamiento local
            window.location.href = '../LogIn/Login.html'; // Redirigir al usuario a la página de inicio de sesión
        } else {
            alert('Error al cerrar sesión');
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function ActualizarDatos(validarDatos) {
    if (!validarDatos) return false;

    token = localStorage.getItem('token');

    try {
        const response = await fetch("/login/client", {
            method: 'POST',
            headers: {
                'Authorization': token
            }
        });
        if (response.ok) {
            const data = await response.json();
            if (data.message) window.location.href = "../Error/PagError404.html";

            document.getElementById("full-name").innerHTML = data.nombre;
            document.getElementById("balance-amount").innerHTML = "$" + parseFloat(data.saldo);
            document.getElementById("cedula").innerHTML = data.cedula;
            document.getElementById("telefono").innerHTML = data.telefono;
            document.getElementById("modelo-carro").innerHTML = data.modelo;
            document.getElementById("placa").innerHTML = data.placa;
            document.getElementById("codigo-telepass").innerHTML = data.tarjeta;
            document.getElementById("email").innerHTML = data.correo;
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }


    return false;
}
