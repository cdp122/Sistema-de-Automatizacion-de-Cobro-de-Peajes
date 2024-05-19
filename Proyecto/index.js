//#region Dependencias
const bodyParser = require('body-parser');
const path = require("path");
const mysql = require('mysql');
const fs = require('fs');
//#endregion

//#region Conexión de BDD
function crearConexion(username, password) {
    return mysql.createConnection({
        host: 'localhost',
        database: 'db_proyecto_final',
        user: username,
        password: password
    });
}
//#endregion

//#region Inicio del Server !Importante
const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
console.log(`Comenzando ejecución en http://localhost:${PORT}`)

app.use(express.static(path.join(__dirname, 'WebSite')));
app.use(express.static(path.join(__dirname, 'WebSite', 'BDDPrueba')));

app.listen(PORT, () => {
    console.log("El servidor ahora está escuchando...");
});
//#endregion

//#region Puertos
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const conexion = crearConexion(username, password);

    conexion.connect((error) => {
        if (error) {
            console.log("Conexión fallida.", error);
            res.send('<script>alert("Usuario no reconocido"); window.location.href = "/";</script>');
        } else {
            console.log("Conexión exitosa.");
            res.sendFile(path.resolve(__dirname, 'WebSite/BDDPrueba/bdd.html'));
            conexion.end();
        }
    });
});

app.get('/bd', (req, res) => {
    data = conexion.user;
    res.json(data);
})
//#endregion