//#region Dependencias y variables globales
const express = require("express");
const conexion = require("./bdd.js")
const path = require("path");
const bodyParser = require('body-parser');
const { generar, validar } = require("./auth.js");
const { stringify } = require("querystring");
const { env } = require("process");
var { Usuario, Cliente } = require("./clases.js");
const { compareSync } = require("bcryptjs");
Usuario = new Usuario();
Cliente = new Cliente();

const bd = express.Router();
const error = express.Router();

var nums, tarjetaID;

async function recargarNums() {
    let num = await conexion.ConseguirNumFilas("tb_movimientos");
    nums = 10000 + parseInt(num[0].TABLE_ROWS);
}

async function recargarTarjetaID() {
    let num = await conexion.ConseguirNumFilas("tb_tarjetas")
    tarjetaID = 10000 + parseInt(num[0].TABLE_ROWS);
}
//#endregion

//#region Ruta 'clientes'
const clientes = express.Router();
clientes.use(bodyParser.urlencoded({ extended: true }));
clientes.use(bodyParser.json());

clientes.get('/', validar, async (req, res) => {
    console.log("Intentando iniciar sesión...");

    const usuario = await conexion.ConseguirRegistros(
        "tb_usuarios", "id", req.user.username
    )
    const cuenta = await conexion.ConseguirRegistros(
        "tb_clientes", "idCliente", req.user.username
    )
    const tarjetas = await conexion.ConseguirRegistros(
        "tb_tarjetas", "idCliente", req.user.username
    )

    Cliente.Crear(usuario, cuenta, tarjetas);

    for (const tarjeta of Cliente.tarjetas) {
        const vehiculos = await conexion.ConseguirRegistros(
            "tb_vehiculos", "tarjetaVeh", tarjeta.id
        );
        Cliente.AgregarVehiculo(vehiculos[0]);
    }

    const enviar = {
        nombre: Cliente.nombres,
        saldo: Cliente.saldoTotal,
        cedula: Cliente.cedula,
        telefono: Cliente.telefono,
        correo: Cliente.correo,
        tarjetas: Cliente.tarjetas,
        vehiculos: Cliente.vehiculos
    }

    console.log("Sesión autorizada a " + req.user.username);
    res.json(enviar);
})

clientes.post('/', validar, async (req, res) => {
    console.log("Intentando guardar datos...");

    const usuario = await conexion.ConseguirRegistros(
        "tb_usuarios", "id", req.user.username
    )
    const cuenta = await conexion.ConseguirRegistros(
        "tb_clientes", "idCliente", req.user.username
    )
    const vehiculo = await conexion.ConseguirRegistros(
        "tb_vehiculos", "tarjetaVeh", cuenta[0].tarjeta
    )

    const enviar = {
        nombre: usuario[0].nombres,
        saldo: cuenta[0].saldo,
        cedula: usuario[0].cedula,
        telefono: usuario[0].telefono,
        modelo: vehiculo[0].modelo,
        placa: vehiculo[0].placa,
        tarjeta: cuenta[0].tarjeta,
        correo: cuenta[0].correo
    }

    res.json(enviar);
})

clientes.get('/movs', validar, async (req, res) => {
    console.log("Solicitando movimientos de", req.query.tarjeta)
    const movimientos = await conexion.ConseguirRegistros(
        "tb_movimientos", "tarjetaMov", req.query.tarjeta
    )
    console.log("Enviando Movimientos");
    res.json(movimientos);
})

clientes.delete('/movs', validar, async (req, res) => {
    console.log("Solicitando eliminar movimientos de", req.query.id)

    const tarjeta = await conexion.ConseguirRegistros(
        "tb_tarjetas", "tarjeta", req.query.tarjeta
    )

    const movimiento = await conexion.ConseguirRegistros(
        "tb_movimientos", "idTransaccion", req.query.id
    )

    const eliminar = await conexion.BorrarRegistro(
        "tb_movimientos", "idTransaccion", req.query.id
    )

    const nuevoSaldo = parseFloat(tarjeta[0].saldo)
        - parseFloat(movimiento[0].valor).toFixed(2);

    await conexion.ModificarRegistro(
        "tb_tarjetas", "saldo", nuevoSaldo,
        "tarjeta", req.query.tarjeta
    )

    console.log("Eliminando Movimiento");
    res.json(eliminar);
})

clientes.post('/movs', validar, async (req, res) => {
    console.log(req.query.tarjeta, req.query.saldo, req.query.valor);

    await recargarNums();
    const id = nums;

    await conexion.InsertarRegistro(
        "tb_movimientos", ["idTransaccion", "tarjetaMov",
        "tipoMovimiento", "valor", "fecha"], [id,
        req.query.tarjeta, 1, req.query.valor,
        "current_timestamp()"]
    )

    await conexion.ModificarRegistro(
        "tb_tarjetas", "saldo", req.query.saldo, "tarjeta", req.query.tarjeta
    )

    console.log("Recarga realizada exitosamente");
    res.json("ok");
})

clientes.post('/account', validar, async (req, res) => {
    const cuenta = req.body;

    await conexion.ModificarRegistro("tb_clientes", "correo", cuenta.correo, "idCliente", req.user.username)

    await conexion.ModificarRegistros("tb_usuarios",
        ["id", "cedula", "telefono"], [cuenta.id, cuenta.cedula, cuenta.telefono],
        "id", req.user.username
    )

    req.user.username = cuenta.id;

    res.json("ok");
})

clientes.get('/passcode', validar, async (req, res) => {
    await recargarTarjetaID();

    conexion.InsertarRegistro("tb_tarjetas", ["idCliente", "tarjeta", "saldo"],
        [req.user.username, tarjetaID, 0]
    )

    conexion.InsertarRegistro("tb_vehiculos", ["tarjetaVeh", "placa", "modelo", "color", "tipo"],
        [tarjetaID, "ABC1234", "Modelo", "GRIS", "CAMIONETA"]
    )

    res.json(tarjetaID);
})
//#endregion

//#region Ruta 'log-in'
const login = express.Router();
login.use(bodyParser.urlencoded({ extended: true }));
login.use(bodyParser.json());

login.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../WebSite/Client/Login.html'));
})

login.get('/authclient', async (req, res) => {
    try {
        const username = decodeURIComponent(req.query.username).toUpperCase();
        const password = decodeURIComponent(req.query.password);

        console.log(`Autorización solicitada por: ${username}`);

        const credenciales = await conexion.LogInClient(username)
        if (credenciales && credenciales[0] &&
            credenciales[0].idCliente === username &&
            credenciales[0].contraseña === password) {
            const user = { username: username };
            const token = generar(user);
            console.log("Usuario enviado " + username);
            res.json({
                message: "Usuario autenticado",
                tipo: "Cliente",
                token: token,
            });
        } else {
            console.log(`Autorización denegeada a: ${username}`);
            res.status(401).json({ message: "Error, usuario no detectado" });
        }
    } catch (error) {
        console.error("Error en /authclient:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

login.get('/authemployee', async (req, res) => {
    const username = decodeURIComponent(req.query.username);
    const password = decodeURIComponent(req.query.password);

    const credenciales = await conexion.LogInEmpleado(username)
    if (credenciales != null && credenciales[0] != null &&
        credenciales[0].idEmpleado == username &&
        credenciales[0].contraseña == password) {
        const user = { username: username };
        const token = generar(user);
        res.json({
            message: "Usuario autenticado",
            tipo: "Empleado",
            token: token,
        });
    } else {
        return res.status(401).json({ message: "Error, usuario no detectado" });
    }
})

login.delete('/close', validar, (req, res) => {
    console.log("Cerrando sesión...");
    res.json({ message: 'Sesión cerrada exitosamente' });
})
//#endregion

//#region Ruta register
const register = express.Router();
register.use(bodyParser.urlencoded({ extended: true }));
register.use(bodyParser.json());

register.post("/", async (req, res) => {
    const registro = req.body;

    await recargarTarjetaID();

    await conexion.InsertarRegistro("tb_usuarios", ["id", "nombres",
        "cedula", "telefono", "fecha_nacimiento"], ["C" + registro.cedula, registro.nombres, registro.cedula,
        registro.telefono, registro.fecha])

    await conexion.InsertarRegistro("tb_clientes", ["idCliente", "correo", "contraseña"],
        ["C" + registro.cedula, registro.correo, registro.contraseña])

    await conexion.InsertarRegistro("tb_tarjetas", ["idCliente", "tarjeta", "saldo"],
        ["C" + registro.cedula, tarjetaID.toString(), 0]
    )

    await conexion.InsertarRegistro("tb_vehiculos", ["tarjetaVeh", "placa",
        "modelo", "color", "tipo"], [tarjetaID.toString(), registro.placa,
        registro.modelo, registro.color, registro.tipoVehiculo.toUpperCase()]);

    res.json("ok");
})
//#endregion

//#region Ruta error404 
//IMPORTANTE: SIEMPRE MANTENER AL PENULTIMO ESTA SECCIÓN
error.get('/404', (req, res) => {
    res.sendFile(path.resolve(__dirname, "../WebSite/Error/PagError404.html"));
})
//#endregion

module.exports =
    { bd, clientes, login, error, register };