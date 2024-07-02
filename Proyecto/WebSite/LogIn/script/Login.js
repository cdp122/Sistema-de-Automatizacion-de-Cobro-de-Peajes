function validateInput(input) {
    //input.value = input.value.replace(/[^0-9]/g, '').slice(0, 11);
}
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const despDiv = document.querySelector(".Desp");
    const navLinks = document.querySelectorAll(".navDes a");

    const handleResize = () => {
        if (window.innerWidth >= 769) {
            menuToggle.checked = false;
            despDiv.style.display = "none";
        }
    };

    menuToggle.addEventListener("change", () => {
        if (menuToggle.checked) {
            despDiv.style.display = "block";
        } else {
            despDiv.style.display = "none";
        }
    });

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            menuToggle.checked = false;
            despDiv.style.display = "none";
        });
    });

    window.addEventListener("resize", handleResize);
    handleResize(); // Llamar a handleResize al cargar la página
});

async function Validar() {
    event.preventDefault();

    const user = document.getElementById("username").value.toUpperCase();
    const contraseña = document.getElementById("password").value;

    try {
        let response;
        if (user[0] === "C") {
            response = await fetch("/login/authclient?username=" + encodeURIComponent(user) + "&password=" + encodeURIComponent(contraseña), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else if (user[0] === "E") {
            response = await fetch("/login/authemployee?username=" + encodeURIComponent(user) + "&password=" + encodeURIComponent(contraseña), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            alert("Credenciales incorrectas, intente de nuevo por favor.");
            return;
        }

        if (response.ok) {
            const result = await response.json();

            if (result.tipo === "Cliente") {
                localStorage.setItem('token', result.token);
                window.location.href = "../../Client/html/perfil.html";
            } else if (result.tipo === "Empleado") {
                localStorage.setItem('token', result.token);
                window.location.href = "../../Empleado/Html/empleado.html";
            } else {
                alert("Tipo de usuario desconocido: " + result.tipo);
            }
        } else {
            const errorResult = await response.json();
            alert(errorResult.message || "Error desconocido");
        }
    } catch (error) {
        console.error(error);
        alert("Error: " + error.message);
    }
}
