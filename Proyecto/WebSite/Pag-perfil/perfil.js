var token;
const camposEditables = ["cedula", "telefono", "email"];
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
    let correo = document.getElementById("email").textContent;

    let guardar = true;

    if (!/^\d{10}$/.test(cedula)) {
        alert("La cédula debe contener 10 dígitos y solo números.");
        guardar = false;
    }

    if (!/^\d{10}$/.test(telefono)) {
        alert("El nro de Telefono debe contener 10 dígitos y solo números.");
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

async function recargarSaldo(saldo, tarjeta) {
    console.log(tarjeta);
    let saldoActual = parseFloat(saldo.textContent.replace('$', ''));
    let nuevoSaldo = prompt("Ingrese el monto a recargar:");
    let actualizacionSaldo = parseFloat(saldoActual) + parseFloat(nuevoSaldo);

    if (nuevoSaldo !== null && !isNaN(nuevoSaldo) && nuevoSaldo > 0 && actualizacionSaldo <= 99.99) {
        RecargarTarjeta(tarjeta.textContent, actualizacionSaldo.toFixed(2), parseFloat(nuevoSaldo).toFixed(2));
        saldo.textContent = `${actualizacionSaldo.toFixed(2)}`;
    }
    else if (actualizacionSaldo > 99.99) {
        alert("No se permite exceder la cantidad de Saldo de 99.99$");
    }
    else {
        alert("Ingrese un monto válido.");
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
            document.getElementById("email").innerHTML = data.correo;
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }


    return false;
}

function AgregarTarjeta() {
    var caja = document.createElement('div');
    caja.className = 'cajaTarjeta';

    var boton = document.createElement('button');
    boton.className = 'editar';
    boton.textContent = 'Editar Tarjeta';
    boton.addEventListener("click", EditarTarjeta);


    var boton2 = document.createElement('button');
    boton2.className = 'agregar';
    boton2.textContent = 'Recargar Saldo';

    var boton3 = document.createElement('button');
    boton3.className = 'movi';
    boton3.textContent = 'Movimientos';
    boton3.addEventListener("click", ListarMovimientos);

    var titulo = document.createElement('h2');
    titulo.textContent = 'Tarjeta';

    caja.appendChild(titulo);

    var lista = document.createElement('ul');

    var elemento = document.createElement('li');
    var letra = document.createElement('strong');
    letra.textContent = 'Modelo de auto';
    var spanModelo = document.createElement('span');
    spanModelo.id = 'modelo-carro';
    spanModelo.textContent = 'Modelo de auto';
    elemento.appendChild(letra);
    elemento.appendChild(spanModelo);
    lista.appendChild(elemento);

    var elemento2 = document.createElement('li');
    var letra2 = document.createElement('strong');
    letra2.textContent = 'Placa:';
    var spanModelo2 = document.createElement('span');
    spanModelo2.id = 'placa';
    spanModelo2.textContent = 'ABC-123';
    elemento2.appendChild(letra2);
    elemento2.appendChild(spanModelo2);
    lista.appendChild(elemento2);

    var elemento3 = document.createElement('li');
    var letra3 = document.createElement('strong');
    letra3.textContent = 'Tarjeta Telepass';
    var spanModelo3 = document.createElement('span');
    spanModelo3.id = 'codigo-telepass';
    spanModelo3.textContent = '1234567890';
    elemento3.appendChild(letra3);
    elemento3.appendChild(spanModelo3);
    lista.appendChild(elemento3);

    var elemento4 = document.createElement('li');
    var letra4 = document.createElement('strong');
    letra4.textContent = 'Saldo';
    var spanModelo4 = document.createElement('span');
    spanModelo4.id = 'saldo';
    spanModelo4.textContent = '10';
    elemento4.appendChild(letra4);
    elemento4.appendChild(spanModelo4);
    lista.appendChild(elemento4);

    boton2.addEventListener('click', function () {
        recargarSaldo(spanModelo4, spanModelo3);
    });

    caja.appendChild(lista);
    caja.appendChild(boton);
    caja.appendChild(boton2);
    caja.appendChild(boton3);
    var ubicacion = document.getElementById('tarjetas');
    ubicacion.appendChild(caja);
}

function CargarTarjetas(tarjeta, vehiculo) {
    console.log("Funca mi funcion");
    var caja = document.createElement('div');
    caja.className = 'cajaTarjeta';

    var boton = document.createElement('button');
    boton.className = 'editar';
    boton.textContent = 'Editar Tarjeta';
    boton.addEventListener("click", EditarTarjeta);

    var boton2 = document.createElement('button');
    boton2.className = 'movi';
    boton2.textContent = 'Movimientos';
    boton2.addEventListener("click", ListarMovimientos);

    var boton3 = document.createElement('button');
    boton3.className = 'agregar';
    boton3.textContent = 'Recargar Saldo';

    var titulo = document.createElement('h2');
    titulo.textContent = 'Tarjeta';

    caja.appendChild(titulo);

    var lista = document.createElement('ul');

    var elemento = document.createElement('li');
    var letra = document.createElement('strong');
    letra.textContent = "Modelo de Vehículo";
    var spanModelo = document.createElement('span');
    spanModelo.id = 'modelo-carro';
    spanModelo.textContent = vehiculo.modelo;
    elemento.appendChild(letra);
    elemento.appendChild(spanModelo);
    lista.appendChild(elemento);

    var elemento2 = document.createElement('li');
    var letra2 = document.createElement('strong');
    letra2.textContent = 'Placa:';
    var spanModelo2 = document.createElement('span');
    spanModelo2.id = 'placa';
    spanModelo2.textContent = vehiculo.placa;
    elemento2.appendChild(letra2);
    elemento2.appendChild(spanModelo2);
    lista.appendChild(elemento2);

    var elemento3 = document.createElement('li');
    var letra3 = document.createElement('strong');
    letra3.textContent = 'Tarjeta Telepass';
    var spanModelo3 = document.createElement('span');
    spanModelo3.id = 'codigo-telepass';
    spanModelo3.textContent = tarjeta.id;
    elemento3.appendChild(letra3);
    elemento3.appendChild(spanModelo3);
    lista.appendChild(elemento3);

    var elemento4 = document.createElement('li');
    var letra4 = document.createElement('strong');
    letra4.textContent = 'Saldo';
    var spanModelo4 = document.createElement('span');
    spanModelo4.id = 'saldo';
    spanModelo4.textContent = "$" + parseFloat(tarjeta.saldo);
    elemento4.appendChild(letra4);
    elemento4.appendChild(spanModelo4);
    lista.appendChild(elemento4);

    caja.appendChild(lista);
    caja.appendChild(boton);
    caja.appendChild(boton2);
    caja.appendChild(boton3);
    var ubicacion = document.getElementById('tarjetas');
    ubicacion.appendChild(caja);

    boton3.addEventListener('click', function () {
        recargarSaldo(spanModelo4, spanModelo3);
    });
}

function validarTarjeta(input) {
    var valor = input.value.trim();
    var id = input.id;

    if (valor === '') {
        input.dataset.error = "Este campo no debe estar vacío.";
        return false;
    }

    switch (id) {
        case 'modelo-carro':
            if (!/^[a-zA-Z\s]+$/.test(valor)) {
                input.dataset.error = "El modelo del auto solo debe contener letras.";
                return false;
            }
            break;
        case 'placa':
            if (!/^[a-zA-Z0-9]{6}$/.test(valor)) {
                input.dataset.error = "La placa debe tener exactamente 6 digitos.";
                return false;
            }
            break;
        case 'codigo-telepass':
            if (!/^\d{10}$/.test(valor)) {
                input.dataset.error = "El código Telepass debe tener exactamente 10 dígitos.";
                return false;
            }
            break;
        default:
            break;
    }

    delete input.dataset.error;
    return true;
}

function EditarTarjeta(event) {
    var caja = event.target.parentNode;

    var spans = caja.querySelectorAll('span');

    spans.forEach(function (span) {
        if (span.id !== 'saldo') {
            var input = document.createElement('input');
            input.type = 'text';
            input.value = span.textContent;
            input.id = span.id;
            span.parentNode.replaceChild(input, span);
        }

    });

    event.target.textContent = 'Guardar Cambios';
    event.target.removeEventListener("click", EditarTarjeta);
    event.target.addEventListener("click", GuardarCambios);
}

function GuardarCambios(event) {

    var caja = event.target.parentNode;

    var inputs = caja.querySelectorAll('input');

    var datosValidos = true;

    inputs.forEach(function (input) {
        if (!validarTarjeta(input)) {

            datosValidos = false;
            input.style.borderColor = 'red';
            if (input.dataset.error) {
                window.alert(input.dataset.error);
            }
        }
        else {
            input.style.borderColor = '';
        }
    });

    if (datosValidos) {

        inputs.forEach(function (input) {
            var span = document.createElement('span');
            span.id = input.id;
            span.textContent = input.value;
            input.parentNode.replaceChild(span, input);
        });

        event.target.textContent = 'Editar Tarjeta';
        event.target.removeEventListener("click", GuardarCambios);
        event.target.addEventListener("click", EditarTarjeta);
    }
    else {
        window.alert("Corrije los campos en rojo");
    }


}


async function ListarMovimientos(event) {
    var caja = event.target.parentNode;
    const codigoTelepas = caja.querySelector('#codigo-telepass').textContent;

    localStorage.setItem("tarjeta", codigoTelepas);
    window.location.href = "./movimientos.html";
}

//#region Backend
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
            document.getElementById("balance-amount").innerHTML = "$" + parseFloat(data.saldo).toFixed(2);
            document.getElementById("cedula").innerHTML = data.cedula;
            document.getElementById("telefono").innerHTML = data.telefono;

            document.getElementById("email").innerHTML = data.correo;

            for (let i = 0; i < data.tarjetas.length; i++) {
                CargarTarjetas(data.tarjetas[i], data.vehiculos[i]);
            }
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function RecargarTarjeta(tarjeta, nuevoSaldo, valor) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch("/clientes/movs?tarjeta=" + tarjeta +
            "&saldo=" + nuevoSaldo + "&valor=" + valor, {
            method: 'POST',
            headers: {
                'Authorization': token
            }
        });
        if (response.ok) {
            alert("Recarga exitosa");
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
//#endregion