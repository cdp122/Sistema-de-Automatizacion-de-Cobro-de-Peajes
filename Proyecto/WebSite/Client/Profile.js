var token;

document.addEventListener('DOMContentLoaded', async () => {
    await Validar();
})

async function Validar() {
    token = localStorage.getItem('token');

    try {
        const response = await fetch("/login/client", {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        });
        if (response.ok) {
            const data = await response.json();
            document.getElementById("saldo").innerHTML = decodeURIComponent(data);
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function EditProfile() {
    alert("funca");
}

async function CloseSesion() {
    try {
        const response = await fetch('/login/client', {
            method: 'DELETE',
            headers: {
                'Authorization': token
            }
        });

        if (response.ok) {
            localStorage.removeItem('token'); // Eliminar el token del almacenamiento local
            window.location.href = './Login.html'; // Redirigir al usuario a la página de inicio de sesión
        } else {
            alert('Error al cerrar sesión');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}