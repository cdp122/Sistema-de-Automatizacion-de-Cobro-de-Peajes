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
const clientes = express.Router();
const error = express.Router();

const login = express.Router();
login.use(bodyParser.urlencoded({ extended: true }));
login.use(bodyParser.json());
//#endregion

//#region Ruta '/bd'
bd.delete('/', async (req, res) => {
    console.log("Borrando registro", req.query.cedula);

    if (!conexion) {
        return res.status(500).json({ error: 'No hay conexión a la base de datos' });
    }

    const success = await conexion.BorrarRegistro(req.query.cedula);

    if (success) res.json({ success: true });
    else {
        res.send('<script>alert("ERROR: No se pudo borra el registro\n' + //Probar solo alert.
            error + '); window.location.href = "/";</script>');
        res.status(400).send({ error: 'Error en la consulta' });
    }
});

bd.post('/', async (req, res) => {
    console.log("Consiguiendo registro", req.query.cedula);

    if (!conexion) {
        return res.status(500).json({ error: 'No hay conexión a la base de datos' });
    }

    const success = await conexion.LogIn(cedula);

    if (success) res.sendFile(path.resolve(__dirname, 'WebSite/BDDPrueba/clientes.html'));
    else {
        alert('<script>alert("ERROR: No se pudo borra el registro\n' +
            error + '); window.location.href = "/";</script>');
        res.status(400).send({ error: 'Error en la consulta' });
    }
});

bd.get('/access', async (res, req) => {
    if (!conexion) {
        return res.status(500).json({ error: 'No hay conexión a la base de datos' });
    }

    try {
        const results = await conexion.Consultar('SELECT * FROM tb_clientes_prueba');
        const Clientes = results.map(result => ({
            nombre: result.nombres,
            contraseña: result.contraseña,
            cedula: result.cedula,
            correo: result.correo,
            placa: result.placa,
            tarjeta: result.tarjeta
        }));
        req.json(Clientes);
    } catch (error) {
        console.error(error);
        res.statusCode = 400;
        res.send({ error: 'Error en la consulta' });
    }
    finally {
        conexion.end();
        console.log("Se cerró la conexión en get/bd/access")
    }
})
//#endregion

//#region Ruta 'clientes'
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

clientes.get('/movs', validar, async (req, res) => {
    console.log("Solicitando movimientos de", req.query.tarjeta)
    const movimientos = await conexion.ConseguirRegistros(
        "tb_movimientos", "tarjetaMov", req.query.tarjeta
    )
    console.log("Enviando Movimientos");
    res.json(movimientos);
})

clientes.delete('/movs', validar, async (req, res) => {
    console.log("Solicitando movimientos de", req.query.tarjeta)
    const movimientos = await conexion.BorrarRegistro(
        "tb_movimientos", "tarjetaMov", req.query.tarjeta
    )
    console.log("Enviando Movimientos");
    res.json(movimientos);
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
//#endregion

//#region Ruta 'log-in'
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

//#region Ruta error404 
//IMPORTANTE: SIEMPRE MANTENER AL PENULTIMO ESTA SECCIÓN
error.get('/404', (req, res) => {
    res.sendFile(path.resolve(__dirname, "../WebSite/Error/PagError404.html"));
})
//#endregion

module.exports =
    { bd, clientes, login, error };