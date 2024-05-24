//#region Dependencias
const bodyParser = require('body-parser');
const path = require("path");
const fs = require('fs');
const { bd, clientes } = require("./modules/routes");
const conexion = require("./modules/bdd");
//#endregion

//#region Inicio del Server !Importante
const PORT = process.env.PORT || 3000;
const express = require('express');
const { secureHeapUsed } = require('crypto');
const app = express();
console.log(`Comenzando ejecución en http://localhost:${PORT}`)
app.listen(PORT, () => {
    console.log("El servidor ahora está escuchando...");
});
//#endregion

//#region Puertos
app.use('/bd', bd);
app.use('/clientes', clientes);
//#endregion

//#region Cargar archivos
app.use(express.static(path.join(__dirname, 'WebSite')));
app.use(express.static(path.join(__dirname, 'WebSite', 'BDDPrueba')));
app.use(express.static(path.join(__dirname, 'WebSite', 'Assets')));
app.use(express.static(path.join(__dirname, 'WebSite', 'Modules')));
//#endregion

//#region Inicio
app.use(bodyParser.urlencoded({ extended: true }));
let uName;
let uPass;

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'WebSite/BDDPrueba/index.html'));
});
//#endregion

//#region exportaciones

//#endregion