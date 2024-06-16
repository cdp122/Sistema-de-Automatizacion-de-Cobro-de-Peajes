
/**
 * condición para comprobar si el navegador soporta la IndexedDB
 */
if (!window.indexedDB) {
    alert("Sorry! Your browser does not support IndexedDB");
}


var bd; // variable de base de datos
/**
 * Iniciar la Base de Datos
 * @function {IniciarBaseDatos}
 */
function IniciarBaseDatos() {
    var solicitud = indexedDB.open("Datos-De-Contacto");
    solicitud.addEventListener("error", MostrarError);
    solicitud.addEventListener("success", Comenzar);
    solicitud.addEventListener("upgradeneeded", CrearAlmacen);
}

function MostrarError(evento) {
    alert("Tenemos un ERROR: " + evento.code + " / " + evento.message);
}
function Comenzar(evento) {
    bd = evento.target.result;
}

function CrearAlmacen(evento) {
    var basedatos = evento.target.result;
    var almacen = basedatos.createObjectStore("Contactos", { keyPath: "id" });
}
window.addEventListener("load", IniciarBaseDatos);