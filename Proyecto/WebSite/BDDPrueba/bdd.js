var data;
//#region solicitudes.
const xhr = new XMLHttpRequest();
xhr.open('GET', 'http://localhost:3000/bd');
xhr.onload = function () {
    if (xhr.status === 200) {
        data = JSON.parse(xhr.responseText);
        console.log(data);
    } else {
        console.error('Error:', xhr.statusText);
    }
};
xhr.send();

fetch('http://localhost:3000/bd')
    .then(response => response.json())
    .then(data => {
        username = data.user; // Assuming data has a "user" property
        console.log(username);
        document.getElementById("Nombre").innerHTML = username;
    })
    .catch(error => console.error('Error:', error));

document.addEventListener("DOMContentLoaded", () => {
    // Code execution remains the same
});
//#endregion

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("Nombre").innerHTML = data.user;
});
