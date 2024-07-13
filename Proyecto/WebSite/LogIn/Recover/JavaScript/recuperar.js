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
                Swal.fire({
                    title: 'Contraseña restablecida',
                    html: `
                        <p>Su contraseña ha sido restablecida. Su nueva contraseña es:</p>
                        <p><strong id="nuevaContrasena">${data}</strong></p>
                        <button id="copiarBtn" class="swal2-confirm swal2-styled">Copiar Contraseña</button>
                    `,
                    didOpen: () => {
                        const copiarBtn = document.getElementById('copiarBtn');
                        copiarBtn.addEventListener('click', () => {
                            const nuevaContrasena = document.getElementById('nuevaContrasena').textContent;
                            navigator.clipboard.writeText(nuevaContrasena).then(() => {
                                Swal.fire('Copiado!', 'La contraseña ha sido copiada al portapapeles', 'success');
                            }).catch(err => {
                                Swal.fire('Error', 'No se pudo copiar la contraseña', 'error');
                            });
                        });
                    }
                }).then(() => {
                    window.location.href = "../../html/Login.html";
                });
            }
            else {
                Swal.fire('Error', 'Datos inválidos', 'error');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'Ocurrió un error. Inténtelo de nuevo más tarde.', 'error');
    }
}