async function Recuperar() {
    const data = {
        cedula: document.getElementById("cedula").value,
        fecha: document.getElementById("fechanac").value,
        correo: document.getElementById("correo").value
    }
    try {
        const response = await fetch("/recover/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            const data = await response.json();
            if (data != "Datos inválidos") {
                alert("Su cuenta ha sido restablecida. Su nueva contraseña es: " + data + ".\nSe le regresará al LogIn");
                window.location.href = "../../html/Login.html";
            }
            else alert(data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}