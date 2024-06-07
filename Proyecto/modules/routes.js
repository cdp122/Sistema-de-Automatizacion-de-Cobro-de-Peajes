//#region Dependencias y variables globales
const express = require("express");
const conexion = require("./bdd.js")
const path = require("path");
const bodyParser = require('body-parser');
const { generar, validar } = require("./auth.js");
const { stringify } = require("querystring");

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

    const success = await conexion.ConseguirRegistros(cedula);

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
clientes.get('/', async (req, res) => {
    const conexion = bdd.crearConexion(uName, uPass);
    if (!conexion) {
        return res.status(500).json({ error: 'No hay conexión a la base de datos' });
    }

    try {
        const results = await bdd.consultar(conexion,
            "SELECT * FROM tb_clientes_prueba " +
            "WHERE cedula='" + cedula + "'");
        const Clientes = results.map(result => ({
            nombre: result.nombres,
            contraseña: result.contraseña,
            cedula: result.cedula,
            correo: result.correo,
            placa: result.placa,
            tarjeta: result.tarjeta
        }));
        console.log("datos recibidos: " + Clientes);
        res.json(Clientes);
    } catch (error) {
        console.error(error);
        res.statusCode(400).send({ error: 'Error en la consulta' });
    }
    finally {
        conexion.end();
        console.log("Se cerró la conexión en get/bd/access")
    }
});

clientes.post('/', async (req, res) => {
    const registro = {
        nombre: decodeURIComponent(req.query.nombre),
        cedula: decodeURIComponent(req.query.cedula),
        contraseña: decodeURIComponent(req.query.contraseña),
        correo: decodeURIComponent(req.query.correo),
        placa: decodeURIComponent(req.query.placa),
        tarjeta: decodeURIComponent(req.query.tarjeta),
        current: decodeURIComponent(req.query.current)
    }

    const conexion = bdd.crearConexion(uName, uPass);
    if (!conexion) {
        return res.status(500).json({ error: 'No hay conexión a la base de datos' });
    }


    if (registro.current != 'undefined') {
        const success = await conexion.ModificarRegistro(registro);

        if (success) res.sendFile(path.resolve(__dirname, 'WebSite/BDDPrueba/bdd.html'));
        else {
            res.send('<script>alert("ERROR: No se pudo modificar el registro\n' +
                error + '); window.location.href = "/";</script>');
            res.status(400).send({ error: 'Error en la consulta' });
        }
        console.log("Se cerró la conexión en clientes -> post")
    }
    else {
        const success = await conexion.ModificarRegistro(registro);

        if (success) res.sendFile(path.resolve(__dirname, 'WebSite/BDDPrueba/bdd.html'));
        else {
            res.send('<script>alert("ERROR: No se pudo modificar el registro\n' +
                error + '); window.location.href = "/";</script>');
            res.status(400).send({ error: 'Error en la consulta' });
        }
        console.log("Se cerró la conexión en clientes -> post")
    }
})
//#endregion

//#region Ruta 'log-in'
login.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../WebSite/Client/Login.html'));
})

login.get('/auth', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    const credenciales = conexion.ConseguirRegistros(username)
    if (credenciales != null &&
        credenciales.cedula == username &&
        credenciales.contraseña == password) {
        const user = { username: username };
        const token = generar(user);
        res.json({
            message: "Usuario autenticado",
            token: token,
        });
    } else {
        return res.status(401).json({ message: "Error, usuario no detectado" });
    }
})

login.get('/client', validar, (req, res) => {
    //!Importante aqui agregar lo necesario para la bdd
    const datos = { saldo: "100.00$" };

    res.json(stringify(datos));
})

login.delete('/client', validar, (req, res) => {
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