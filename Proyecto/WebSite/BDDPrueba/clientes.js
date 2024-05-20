var data;
//#region solicitudes.
const xhr = new XMLHttpRequest();

async function cargarClientes() {
    try {
        const response = await fetch('http://localhost:3000/clientes');
        if (response.ok) {
            data = await response.json();
            console.log(data);
        } else {
            console.error('Error:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
//#endregion

//#region Main
document.addEventListener("DOMContentLoaded", async () => {
    await cargarClientes();
    console.log(data);
    CargarDatos();
});
//#endregion

//#region cargando datos
function CargarDatos() {
    document.getElementById("nombre").value = data[0].nombre;
    document.getElementById("cedula").value = data[0].cedula;
    document.getElementById("contraseña").value = data[0].contraseña;
    document.getElementById("correo").value = data[0].correo;
    document.getElementById("placa").value = data[0].placa;
    document.getElementById("tarjeta").value = data[0].tarjeta;
}
//#endregion

//#region html functions
async function Guardar() {
    const urlEncodedParams = new URLSearchParams({
        nombre: document.getElementById("nombre").value,
        cedula: document.getElementById("cedula").value,
        contraseña: document.getElementById("contraseña").value,
        correo: document.getElementById("correo").value,
        placa: document.getElementById("placa").value,
        tarjeta: document.getElementById("tarjeta").value,
        current: data[0].cedula
    });

    try {
        const response = await fetch('/clientes?' + urlEncodedParams, {
            method: 'POST',
        });
        if (response.ok) {
            window.location.href = "./bdd.html"
        } else {
            alert('Error al buscar el registro');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
//#endregion