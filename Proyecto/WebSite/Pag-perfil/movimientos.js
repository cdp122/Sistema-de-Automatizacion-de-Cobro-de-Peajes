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

    AgregarPMovimiento(movimientos[0]);
    for (let i = 1; i < movimientos.length; i++) {
        AgregarMovimiento(movimientos[i]);
    }
}

function AgregarPMovimiento(movimiento) {
    cuadro = document.getElementById("movimientos");

    var lista = document.createElement('ul');

    var elemento = document.createElement('li');

    var tituloID = document.createElement('strong');
    tituloID.textContent = "ID Transacción:";
    var spanID = document.createElement('span');
    spanID.textContent = movimiento.idTransaccion;
    spanID.id = "idMov";
    var tituloMov = document.createElement('strong');
    tituloMov.textContent = "Tipo de Movimiento:";
    var spanMov = document.createElement('span');
    if (movimiento.tipoMovimiento == 0) spanMov.textContent = "Cobro";
    else spanMov.textContent = "Recarga";
    var tituloValor = document.createElement('strong');
    tituloValor.textContent = "Valor:";
    var spanValor = document.createElement('span');
    spanValor.textContent = movimiento.valor;
    var tituloFecha = document.createElement('strong');
    tituloFecha.textContent = "Fecha:";
    var spanFecha = document.createElement('span');
    spanFecha.textContent = JSON.stringify(movimiento.fecha).slice(1, 20).replace("T", " ");
    var button = document.createElement('button');
    button.textContent = "Solicitar Devolución";
    button.addEventListener('click', Devolucion);
    elemento.appendChild(tituloID);
    elemento.appendChild(spanID);
    elemento.appendChild(tituloMov);
    elemento.appendChild(spanMov);
    elemento.appendChild(tituloValor);
    elemento.appendChild(spanValor);
    elemento.appendChild(tituloFecha);
    elemento.appendChild(spanFecha);
    elemento.appendChild(button);
    lista.appendChild(elemento);
    cuadro.appendChild(lista);
}

function AgregarMovimiento(movimiento) {
    cuadro = document.getElementById("movimientos");

    var lista = document.createElement('ul');

    var elemento = document.createElement('li');

    var tituloID = document.createElement('strong');
    tituloID.textContent = "ID Transacción:";
    var spanID = document.createElement('span');
    spanID.textContent = movimiento.idTransaccion;
    var tituloMov = document.createElement('strong');
    tituloMov.textContent = "Tipo de Movimiento:";
    var spanMov = document.createElement('span');
    if (movimiento.tipoMovimiento == 0) spanMov.textContent = "Cobro";
    else spanMov.textContent = "Recarga";
    var tituloValor = document.createElement('strong');
    tituloValor.textContent = "Valor:";
    var spanValor = document.createElement('span');
    spanValor.textContent = movimiento.valor;
    var tituloFecha = document.createElement('strong');
    tituloFecha.textContent = "Fecha:";
    var spanFecha = document.createElement('span');
    spanFecha.textContent = JSON.stringify(movimiento.fecha).slice(1, 20).replace("T", " ");
    elemento.appendChild(tituloID);
    elemento.appendChild(spanID);
    elemento.appendChild(tituloMov);
    elemento.appendChild(spanMov);
    elemento.appendChild(tituloValor);
    elemento.appendChild(spanValor);
    elemento.appendChild(tituloFecha);
    elemento.appendChild(spanFecha);
    lista.appendChild(elemento);
    cuadro.appendChild(lista);
}

async function Devolucion(event) {
    var caja = event.target.parentNode;
    const id = caja.querySelector('#idMov').textContent;
    
    try {
        const response = await fetch("/clientes/movs?tarjeta=" + codigoTelepas, {
            method: 'DELETE',
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
}