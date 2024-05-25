//#region Dependencias
const bodyParser = require('body-parser');
const path = require("path");
const { bd, clientes, login, error } = require("./modules/routes");
//#endregion

//#region Setup del Server !Importante
const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
console.log(`Comenzando ejecución en http://localhost:${PORT}`)
app.listen(PORT, () => {
    console.log("El servidor ahora está escuchando...");
});
//#endregion

//#region Puertos
app.use('/bd', bd);
app.use('/clientes', clientes);
app.use('/login', login);
app.use('/error', error);
//#endregion

//#region Inicio
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    console.log("Redirigiendo a", path.resolve(__dirname, 'WebSite/Login.html'))
    res.sendFile(path.resolve(__dirname, 'WebSite/Login.html'));
});
//#endregion

//#region Cargar archivos
app.use(express.static(path.join(__dirname, 'WebSite')));
app.use(express.static(path.join(__dirname, 'WebSite', 'BDDPrueba')));
app.use(express.static(path.join(__dirname, 'WebSite', 'Assets')));
app.use(express.static(path.join(__dirname, 'WebSite', 'Modules')));
//#endregion

//#region exportaciones
module.exports = { app };
//#endregion

//#region ERROR 404
app.get('*', (req, res) => {
    res.redirect('/error/404');
})
//#endregion