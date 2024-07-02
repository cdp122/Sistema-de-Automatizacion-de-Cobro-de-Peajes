//#region Carga Inicial
var token;
const camposEditables = ["telefono", "email", "contraseña"];
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

        if (id == 'contraseña') {
            campo.textContent = '';
        }

        campo.addEventListener("focus", limpiarCampo);
        campo.addEventListener("blur", restaurarCampo);
    });
    editarPerfilBtn.style.display = "none";
    guardarCambiosBtn.style.display = "block";
}

function guardarCambios() {
    let telefono = document.getElementById("telefono").textContent;
    let correo = document.getElementById("email").textContent;
    let contraseña = document.getElementById("contraseña").textContent;

    let guardar = true;

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
        if (!ActualizarPerfil(telefono, correo, contraseña)) {
            alert("No se pudieron actualizar los datos");
            return;
        }
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
            document.getElementById("cedula").innerHTML = data.cedula;
            document.getElementById("telefono").innerHTML = data.telefono;
            document.getElementById("email").innerHTML = data.correo;
            document.getElementById("contraseña").innerHTML = data.contraseña;

            console.log(data);
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
//#endregion