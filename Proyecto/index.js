//#region Dependencias
const bodyParser = require('body-parser');
const path = require("path");
const mysql = require('mysql');
//#endregion

//#region Conexión de BDD
const conexion = mysql.createConnection({
    host: 'localhost',
    database: 'data',
    user: 'root',
    password: ''
});
//#endregion

//#region Inicio del Server !Importante
const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
console.log(`Comenzando ejecución en http://localhost:${PORT}`)

app.use(express.static('WebSite'));

app.listen(PORT, () => {
    console.log("El servidor ahora está escuchando...");
});
//#endregion

//#region Puertos
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', (req, res) => {
    console.log("Se recibieron los datos");
    let user, pass;
    user = req.body.username;
    pass = req.body.password;

    if (user == "Carlos" && pass == "express") {
        res.sendFile(path.resolve(__dirname, 'WebSite/BDDPrueba/bdd.html'))
    }
    else {
        res.send('<script>alert("Usuario no reconocido"); window.location.href = "/";</script>');
    }
})
//#endregion

