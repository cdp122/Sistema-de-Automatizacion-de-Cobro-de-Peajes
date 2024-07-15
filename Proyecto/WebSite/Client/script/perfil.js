//#region Carga Inicial
var token;
const camposEditables = ["cedula", "telefono", "email", "contraseña"];
const editarPerfilBtn = document.getElementById("editar-perfil");
const guardarCambiosBtn = document.getElementById("guardar-cambios");
var selectModelo5;
document.addEventListener("DOMContentLoaded", function () {
    Validar();
});
//#endregion

//#region Front-End
function editarPerfil() {
    camposEditables.forEach(id => {
        const campo = document.getElementById(id);
        campo.setAttribute("contenteditable", "true");
        campo.classList.add("editable");

        campo.classList.remove("ocultar");
        const pl = document.getElementById('muestra');
        if (id == 'contraseña') {
            pl.classList.add("ocultar");
        }

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
    let contraseña = document.getElementById("contraseña").textContent;

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


    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]{5,10}$/.test(contraseña)) {
        alert("La contraseña debe contener entre 5 y 10 caracteres.");
        guardar = false;
    }

    if (guardar) {
        if (!ActualizarPerfil(cedula, telefono, correo, contraseña)) {
            alert("No se pudieron actualizar los datos");
            return;
        }
        camposEditables.forEach(id => {
            const campo = document.getElementById(id);
            campo.setAttribute("contenteditable", "false");
            campo.classList.remove("editable");
            if (id == 'contraseña') {
                campo.classList.add("ocultar");
                document.getElementById('muestra').classList.remove("ocultar");
            }

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
    let saldoActual = parseFloat(saldo.textContent.replace('$', ''));
    let nuevoSaldo = prompt("Ingrese el monto a recargar:");
    let actualizacionSaldo = parseFloat(saldoActual) + parseFloat(nuevoSaldo);

    if (nuevoSaldo !== null && !isNaN(nuevoSaldo) && nuevoSaldo > 0 && actualizacionSaldo <= 99.99) {
        RecargarTarjeta(tarjeta.textContent, actualizacionSaldo.toFixed(2), parseFloat(nuevoSaldo).toFixed(2));
        saldo.textContent = `${actualizacionSaldo.toFixed(2)}`;

        let saldoTotalElemento = document.getElementById('balance-amount');
        let saldoTotalActual = parseFloat(saldoTotalElemento.textContent.replace('$', ''));
        let nuevoSaldoTotal = saldoTotalActual + parseFloat(nuevoSaldo);

        localStorage.setItem('saldoTotal', nuevoSaldoTotal.toFixed(2));

        saldoTotalElemento.textContent = `$${nuevoSaldoTotal.toFixed(2)}`;
    }
    else if (actualizacionSaldo > 99.99) {
        alert("No se permite exceder la cantidad de Saldo de 99.99$");
    }
    else {
        alert("Ingrese un monto válido.");
    }
    location.reload();
}

async function manejarTarjetas(tarjeta, vehiculo) {
    var caja = document.createElement('div');
    caja.className = 'cajaTarjeta';

    var tar = document.createElement('div');
    tar.className = 'cajatar';

    var boton = document.createElement('button');
    boton.className = 'editar';
    boton.textContent = 'Editar Tarjeta';
    boton.id = "editar-tarejta";
    boton.addEventListener("click", EditarTarjeta);

    var boton2 = document.createElement('button');
    boton2.className = 'agregar';
    boton2.textContent = 'Recargar Saldo';

    var boton3 = document.createElement('button');
    boton3.className = 'movi';
    boton3.textContent = 'Movimientos';
    boton3.addEventListener("click", ListarMovimientos);

    var boton4 = document.createElement('button');
    boton4.className = 'eliminar';
    boton4.textContent = 'Deshabilitar Tarjeta';
    boton4.addEventListener('click', function () {
        var saldo = parseFloat(spanModelo.textContent.replace('$', ''));
        if (saldo === 0) {
            Deshabilitar(caja);
        } else {
            alert('La tarjeta no puede ser deshabilitada porque el saldo no es 0.');
        }
    });

    var titulo = document.createElement('h2');
    titulo.textContent = 'Tarjeta';

    caja.appendChild(titulo);
    caja.appendChild(tar);

    var lista = document.createElement('ul');

    var elemento = document.createElement('li');
    var letra = document.createElement('strong');
    letra.textContent = 'Saldo';
    var spanModelo = document.createElement('span');
    spanModelo.id = 'saldo';
    spanModelo.textContent = tarjeta && tarjeta.saldo ? `$${parseFloat(tarjeta.saldo)}` : '0';
    elemento.appendChild(letra);
    elemento.appendChild(spanModelo);
    lista.appendChild(elemento);

    var elemento2 = document.createElement('li');
    var letra2 = document.createElement('strong');
    letra2.textContent = 'Placa:';
    var spanModelo2 = document.createElement('span');
    spanModelo2.id = 'placa';
    spanModelo2.textContent = vehiculo && vehiculo.placa ? vehiculo.placa : 'ABC1234';
    elemento2.appendChild(letra2);
    elemento2.appendChild(spanModelo2);
    lista.appendChild(elemento2);

    var elemento4 = document.createElement('li');
    var letra4 = document.createElement('strong');
    letra4.textContent = 'Modelo de Vehículo';
    var spanModelo4 = document.createElement('span');
    spanModelo4.id = 'modelo-carro';
    spanModelo4.textContent = vehiculo && vehiculo.modelo ? vehiculo.modelo : 'Modelo';
    elemento4.appendChild(letra4);
    elemento4.appendChild(spanModelo4);
    lista.appendChild(elemento4);

    // Crear el elemento select y agregar opciones
    var elemento5 = document.createElement('li');
    var letra5 = document.createElement('strong');
    letra5.textContent = 'Tipo: ';

    // Crear el elemento select
    selectModelo5 = document.createElement('select');
    selectModelo5.id = 'tipoVehiculo';
    selectModelo5.required = true;
    selectModelo5.disabled = true;

    // Añadir opciones al select
    var opciones = [
        { value: '', text: 'Seleccione' },
        { value: 'Livianos', text: 'Livianos' },
        { value: '2 Ejes', text: '2 Ejes' },
        { value: '3 Ejes', text: '3 Ejes' },
        { value: '4 Ejes', text: '4 Ejes' },
        { value: '5 Ejes', text: '5 Ejes' },
        { value: '6 o más Ejes', text: '6 o más Ejes' },
        { value: 'Motos', text: 'Motos' }
    ];

    opciones.forEach(function (opcion) {
        var option = document.createElement('option');
        option.value = opcion.value;
        option.text = opcion.text;
        if (vehiculo && vehiculo.tipo === opcion.value) {
            option.selected = true;
        }
        selectModelo5.appendChild(option);
    });

    elemento5.appendChild(letra5);
    elemento5.appendChild(selectModelo5);
    lista.appendChild(elemento5);

    var elemento6 = document.createElement('li');
    var letra6 = document.createElement('strong');
    letra6.textContent = 'Color:';
    var spanModelo6 = document.createElement('span');
    spanModelo6.id = 'color-carro';
    spanModelo6.textContent = vehiculo && vehiculo.modelo ? vehiculo.color : 'Gris';
    elemento6.appendChild(letra6);
    elemento6.appendChild(spanModelo6);
    lista.appendChild(elemento6);

    var elemento3 = document.createElement('li');
    var letra3 = document.createElement('strong');
    var spanModelo3 = document.createElement('span');
    spanModelo3.id = 'codigo-telepass';

    if (tarjeta && tarjeta.id) spanModelo3.textContent = tarjeta.id;
    else spanModelo3.textContent = await CrearTarjeta();

    elemento3.appendChild(letra3);
    elemento3.appendChild(spanModelo3);
    tar.appendChild(elemento3);


    boton2.addEventListener('click', function () {
        recargarSaldo(spanModelo, spanModelo3);
    });

    caja.appendChild(lista);
    caja.appendChild(boton);
    caja.appendChild(boton2);
    caja.appendChild(boton3);
    caja.appendChild(boton4);
    console.log(tarjeta);

    if (tarjeta.estado == 0) {
        Deshabilitar(caja);
        return;
    }

    var ubicacion = document.getElementById('tarjetas')
    ubicacion.appendChild(caja);
}

async function crearTarjeta() {
    await CrearTarjeta();
    alert("Tarjeta creada exitosamente");
    window.location.reload();
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
            if (!/^[a-zA-Z0-9]{6,7}$/.test(valor)) {
                input.dataset.error = "La placa debe tener exactamente 6 0 7 digitos.";
                return false;
            }
            break;
        default:
            break;
    }

    delete input.dataset.error;
    return true;
}

function habilitarSelect() {
    if (selectModelo5) {
        selectModelo5.disabled = false;
    } else {
        console.error('El select no está definido');
    }
}

function deshabilitarSelect() {
    if (selectModelo5) {
        selectModelo5.disabled = true;
    } else {
        console.error('El select no está definido');
    }
}

function EditarTarjeta(event) {
    var caja = event.target.parentNode;

    var spans = caja.querySelectorAll('span');

    spans.forEach(function (span) {
        var input = document.createElement('input');
        input.type = 'text';
        input.value = span.textContent;
        input.id = span.id;
        span.parentNode.replaceChild(input, span);
    });

    // Habilitar el select para edición
    var select = caja.querySelector('#tipoVehiculo');
    if (select) {
        select.disabled = false;
    }

    event.target.textContent = 'Guardar Cambios';
    event.target.removeEventListener("click", EditarTarjeta);
    event.target.addEventListener("click", GuardarCambios);
}


function GuardarCambios(event) {
    var caja = event.target.parentNode;

    var datosValidos = true;

    var inputs = caja.querySelectorAll('input');
    var datos = [];

    inputs.forEach(function (input) {
        if (!validarTarjeta(input)) {
            datosValidos = false;
            input.style.borderColor = 'red';
            if (input.dataset.error) {
                window.alert(input.dataset.error);
            }
        } else {
            input.style.borderColor = '';
            datos.push(input.value);
        }
    });

    // Validar y agregar el valor del select
    var select = caja.querySelector('#tipoVehiculo');
    if (select && select.value) {
        datos.push(select.value);
    } else {
        datosValidos = false;
        window.alert("Seleccione un tipo de vehículo.");
        select.style.borderColor = 'red';
    }

    datos.push(caja.querySelector("#codigo-telepass").textContent);
    console.log(datos);

    if (datosValidos) {
        ActualizarTarjeta(datos);

        // Reemplazar inputs con spans
        inputs.forEach(function (input) {
            var span = document.createElement('span');
            span.id = input.id;
            span.textContent = input.value;
            input.parentNode.replaceChild(span, input);
        });

        // Mantener el select, pero asegurarse de que sea editable solo cuando se edite la tarjeta
        select.disabled = true;

        event.target.textContent = 'Editar Tarjeta';
        event.target.removeEventListener("click", GuardarCambios);
        event.target.addEventListener("click", EditarTarjeta);
    } else {
        window.alert("Corrija los campos en rojo.");
    }
}



async function ListarMovimientos(event) {

    var caja = event.target.parentNode;
    const codigoTelepas = caja.querySelector('#codigo-telepass').textContent;

    localStorage.setItem("tarjeta", codigoTelepas);
    window.location.href = "./movimientos.html";
}
//#endregion

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
            if (data.message) window.location.href = "../../Error/PagError404.html";

            document.getElementById("full-name").innerHTML = data.nombre + data.apellido;
            document.getElementById("balance-amount").innerHTML = "$" + parseFloat(data.saldo).toFixed(2);
            document.getElementById("cedula").innerHTML = data.cedula;
            document.getElementById("telefono").innerHTML = data.telefono;
            document.getElementById("email").innerHTML = data.correo;
            document.getElementById("contraseña").innerHTML = data.contraseña;

            for (let i = 0; i < data.tarjetas.length; i++) {
                manejarTarjetas(data.tarjetas[i], data.vehiculos[i]); //aqui falta lo de validar la tarjeta
            }
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function ActualizarPerfil(cedula, telefono, correo, contraseña) {
    token = localStorage.getItem('token');
    const data = {
        cedula: cedula,
        telefono: telefono,
        correo: correo,
        id: "C" + cedula,
        contraseña: contraseña
    }
    try {
        const response = await fetch("/clientes/account", {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            alert("Datos actualizados se cerrará la sesión para que los cambios se apliquen correctamente");
            window.location.href = "../../LogIn/html/Login.html";
        } else {
            alert(result.message);
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
    return false;
}

async function ActualizarTarjeta(datos) {
    token = localStorage.getItem('token');
    console.log(datos);
    try {
        const response = await fetch("/clientes/passcode", {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                placa: datos[2],
                modelo: datos[3],
                tipo: datos[5],
                color: datos[4],
                tarjeta: datos[0]
            })
        });
        if (response.ok) {
            alert("Datos actualizados correctamente");
        } else {
            alert(result.message);
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
    return false;
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

async function CrearTarjeta() {
    try {
        const response = await fetch("/clientes/passcode", {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
        });
        if (response.ok) {
            const idTarjeta = await response.json();
            return idTarjeta;
        } else {
            alert(result.message);
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

async function Deshabilitar(caja) {
    const tarjeta = caja.querySelector("#codigo-telepass").textContent;

    try {
        const response = await fetch('/clientes/passcode?tarjeta=' + tarjeta, {
            method: 'DELETE',
            headers: {
                'Authorization': token
            }
        });
        if (response.ok) {
        } else {
            alert('Error al deshabilitar la tarjeta');
        }
    } catch (error) {
        console.error("Error:", error);
    }

    var titulo2 = caja.querySelector('h2');
    titulo2.textContent = "Deshabilitada";

    var quitarBonotes = caja.querySelectorAll('button');
    quitarBonotes.forEach(function (boton) {
        if (boton.className) {
            boton.remove();
        }
    });

    var ubicacion2 = document.getElementById('deshabilitadas');
    ubicacion2.appendChild(caja);

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
            localStorage.removeItem('token');
            window.location.href = '../../LogIn/html/Login.html';
        } else {
            alert('Error al cerrar sesión');
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
//#endregion