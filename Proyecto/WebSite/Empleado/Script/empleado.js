//#region Carga Inicial
var token;
const camposEditables = ["cedula", "telefono", "email", "contraseña"];
const editarPerfilBtn = document.getElementById("editar-perfil");
const guardarCambiosBtn = document.getElementById("guardar-cambios");

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

    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]{10}$/;

    if (!regex.test(contraseña)) {
        alert("La contraseña debe contener 10 caracteres.");
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

//#region Backend
async function Validar() {
    token = localStorage.getItem('token');

    try {
        const response = await fetch("/employee", {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        });
        if (response.ok) {
            const data = await response.json();
            if (data.message) window.location.href = "../../Error/PagError404.html";

            document.getElementById("full-name").innerHTML = data.nombre + data.apellido;
            document.getElementById("rol").innerHTML = data.rol;
            document.getElementById("cedula").innerHTML = data.cedula;
            document.getElementById("telefono").innerHTML = data.telefono;
            document.getElementById("email").innerHTML = data.correo;
            document.getElementById("contraseña").innerHTML = data.contraseña;
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
            localStorage.removeItem('token');
            window.location.href = '../../LogIn/html/Login.html';
        } else {
            alert('Error al cerrar sesión');
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function ActualizarPerfil(cedula, telefono, correo, contraseña) {
    token = localStorage.getItem('token');
    const data = {
        cedula: cedula,
        telefono: telefono,
        correo: correo,
        id: "E" + cedula,
        contraseña: contraseña
    }

    try {
        const response = await fetch("/employee/account", {
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
//#endregion