document.addEventListener('DOMContentLoaded', () => {
    Validar();
})

async function Validar() {
    const token = localStorage.getItem('token')
    const codigoTelepas = localStorage.getItem('tarjeta');
    var movimientos;

    try {
        const response = await fetch("/clientes/movs?tarjeta=" + codigoTelepas, {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        });
        if (response.ok) {
            movimientos = await response.json();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }

    movimientos = movimientos.reverse();

    AgregarPMovimiento(movimientos[0]);
    for (let i = 1; i < movimientos.length; i++) {
        AgregarMovimiento(movimientos[i]);
    }
}

function AgregarPMovimiento(movimiento) {
    cuadro = document.getElementById("movimientos");

    var lista = document.createElement('ul');

    var elemento = document.createElement('li');

    var spanID = document.createElement('span');
    spanID.textContent = movimiento.idTransaccion;
    spanID.id = "idMov";
    var spanMov = document.createElement('span');
    if (movimiento.tipoMovimiento == 0) spanMov.textContent = "Cobro";
    else spanMov.textContent = "Recarga";
    var spanValor = document.createElement('span');
    spanValor.textContent = movimiento.valor;
    var spanFecha = document.createElement('span');
    spanFecha.textContent = JSON.stringify(movimiento.fecha).slice(1, 20).replace("T", " ");
    var button = document.createElement('button');
    button.textContent = "Solicitar Devolución";
    button.addEventListener('click', Devolucion);
    elemento.appendChild(spanID);
    elemento.appendChild(spanMov);
    elemento.appendChild(spanValor);
    elemento.appendChild(spanFecha);
    elemento.appendChild(button);
    lista.appendChild(elemento);
    cuadro.appendChild(lista);
}

function AgregarMovimiento(movimiento) {
    cuadro = document.getElementById("movimientos");

    var lista = document.createElement('ul');

    var elemento = document.createElement('li');

    var spanID = document.createElement('span');
    spanID.textContent = movimiento.idTransaccion;
    var spanMov = document.createElement('span');
    if (movimiento.tipoMovimiento == 0) spanMov.textContent = "Cobro";
    else spanMov.textContent = "Recarga";
    var spanValor = document.createElement('span');
    spanValor.textContent = movimiento.valor;
    var spanFecha = document.createElement('span');
    spanFecha.textContent = JSON.stringify(movimiento.fecha).slice(1, 20).replace("T", " ");
    var btn = document.createElement("button");
    btn.textContent = "No es posible solicit"
    btn.style.visibility = "hidden";

    elemento.appendChild(spanID);
    elemento.appendChild(spanMov);
    elemento.appendChild(spanValor);
    elemento.appendChild(spanFecha);
    elemento.appendChild(btn);
    lista.appendChild(elemento);
    cuadro.appendChild(lista);
}

async function Devolucion(event) {
    var caja = event.target.parentNode;
    const id = caja.querySelector('#idMov').textContent;
    const token = localStorage.getItem("token");
    const tarjeta = localStorage.getItem("tarjeta");

    try {
        const response = await fetch("/clientes/movs?id=" + id
            + "&tarjeta=" + tarjeta, {
            method: 'DELETE',
            headers: {
                'Authorization': token
            }
        });
        if (response.ok) {
            window.location.href = "../html/perfil.html"
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}