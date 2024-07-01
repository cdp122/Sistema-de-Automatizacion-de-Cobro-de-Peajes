//#region Dependencias
const bodyParser = require('body-parser');
const path = require("path");
const { bd, clientes, login, error, register, employee } = require("./modules/routes");
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
app.use('/register', register);
app.use('/employee', employee)
//#endregion

//#region Inicio
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'WebSite', 'Home', 'HTML', 'index.html'));
});
//#endregion

//#region Cargar archivos
app.use(express.static(path.join(__dirname, 'WebSite')));
app.use(express.static(path.join(__dirname, 'WebSite', 'Assets')));
app.use(express.static(path.join(__dirname, 'WebSite', 'Client')));
app.use(express.static(path.join(__dirname, 'WebSite', 'Client', 'html')));
app.use(express.static(path.join(__dirname, 'WebSite', 'Empleado')));
app.use(express.static(path.join(__dirname, 'WebSite', 'Empleado', 'html')));
app.use(express.static(path.join(__dirname, 'WebSite', 'Error')));
app.use(express.static(path.join(__dirname, 'WebSite', 'Home')));
app.use(express.static(path.join(__dirname, 'WebSite', 'Home', 'HTML')));
app.use(express.static(path.join(__dirname, 'WebSite', 'LogIn')));
app.use(express.static(path.join(__dirname, 'WebSite', 'Registro')));
//#endregion

//#region exportaciones. NO MOVER
module.exports = { app };
//#endregion

//#region ERROR 404
app.get('*', (req, res) => {
    res.redirect('/error/404');
})
//#endregion