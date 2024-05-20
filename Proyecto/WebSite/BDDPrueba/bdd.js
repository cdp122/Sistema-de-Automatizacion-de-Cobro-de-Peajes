var tabla;
var data;
var tb_cliente;
//#region solicitudes.
const xhr = new XMLHttpRequest();

xhr.open('GET', 'http://localhost:3000/bd');
xhr.onload = function () {
    console.log(xhr.status);
    if (xhr.status === 200) {
        data = JSON.parse(xhr.responseText);
    } else {
        console.error('Error:', xhr.statusText);
    }
};
xhr.send();
//#endregion

//#region Main
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        VerTabla();
        document.getElementById("Nombre").innerHTML = data.nombre;
    }, 50);

    setTimeout(() => {
        console.log(tabla);
        tb_cliente = document.getElementById("clientes");
        CrearTablas();
    }, 70);
});
//#endregion

//#region funciones de bdd
function VerTabla() {
    xhr.open('GET', 'http://localhost:3000/bd/access');
    console.log("table seen");
    xhr.onload = function () {
        if (xhr.status === 200) {
            tabla = JSON.parse(xhr.responseText);
        } else {
            console.error('Error:', xhr.statusText);
        }
    };
    xhr.send();
}

function CrearTablas() {
    tb_cliente.innerHTML = "<tr><td>Cliente</td>" +
        "<td>Cédula</td><td>Contraseña</td><td>Correo</td><td>Placa</td>" +
        "<td>Tarjeta</td><td></td><td></td></tr>";
    for (let i = 0; i < tabla.length; i++) {
        tb_cliente.innerHTML +=
            "<tr><td>" + tabla[i].nombre + "</td>" +
            "<td>" + tabla[i].cedula + "</td>" +
            "<td>" + tabla[i].contraseña + "</td><td>" + tabla[i].correo + "</td>" +
            "<td>" + tabla[i].placa + "</td><td>" + tabla[i].tarjeta + "</td><td>" +
            "<a onclick='Editar(" + i + ")'>Editar</a>" +
            "<td><a onclick='Borrar(" + i + ")'>Borrar</a></td></tr>";
    }
}
//#endregion

//#region html functions
async function Borrar(index) {
    console.log(index);
    const cedula = tabla[index].cedula;
    try {
        const response = await fetch(`/bd?cedula=${cedula}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        if (result.success) {
            window.location.reload(); // Recargar la página
        } else {
            alert('Error al eliminar el registro');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function Editar(index) {
    console.log(index);
    const cedula = tabla[index].cedula;
    try {
        const response = await fetch(`/bd?cedula=${cedula}`, {
            method: 'POST',
        });
        if (response.ok) {
            // Redirigir a la página de clientes si la respuesta fue exitosa
            window.location.href = './clientes.html';
        } else {
            alert('Error al buscar el registro');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function Salir() {
    try {
        const response = await fetch('/', {
            method: 'DELETE',
        });
        if (response.ok) {
            window.location.href = "../index.html"
        } else {
            alert('No se pudo cerrar sesión.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
//#endregion
