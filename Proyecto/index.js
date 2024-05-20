//#region Dependencias
const bodyParser = require('body-parser');
const path = require("path");
const mysql = require('mysql');
const fs = require('fs');
const { bd, clientes } = require("./modules/routes");
const bdd = require("./modules/bdd");
//#endregion

//#region Conexión de BDD
var conexion;

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
app.use('/bd', bd);
app.use('/clientes', clientes);

app.listen(PORT, () => {
    console.log("El servidor ahora está escuchando...");
});
//#endregion

//#region Puertos
app.use(bodyParser.urlencoded({ extended: true }));
let uName;
let uPass;

app.post('/', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const conexion = crearConexion(username, password);

    conexion.connect((error) => {
        if (error) {
            console.log("==>Conexión fallida.", error);
            res.send('<script>alert("Usuario no reconocido"); window.location.href = "/";</script>');
        } else {
            console.log("===Conexión exitosa===");
            uName = username; uPass = password;
            res.sendFile(path.resolve(__dirname, 'WebSite/BDDPrueba/bdd.html/'));
            conexion.end();
        }
    });
});

app.delete('/', (req, res) => {
    console.log("token eliminado: " + tokensDisponibles.pop())

    res.sendFile(path.resolve(__dirname, 'WebSite/index.html'));
});
//#endregion

//#region Generación de Tokens
var tokensDisponibles = [];

function GenerarToken(inicial) {
    if (tokensDisponibles.length < 6) {
        const fecha = new Date();
        const horas = fecha.getHours();
        const minutos = fecha.getMinutes();
        var token = horas + "" + minutos + inicial;

        for (let i = 0; i < 4; i++) {
            token += GenerarLetra();
        }
        tokensDisponibles.push(token);
        console.log("Token generado:", token)
        return token;
    }
    else {
        console.error("Ya hay 5 personas conectadas actualmente!")
        return null;
    };
}

function GenerarLetra() {
    let numero = Math.random() * 255;
    const token = String.fromCharCode(numero);
    if (token == "" || token == " ") return GenerarLetra();
    else return token;
}
//#endregion

//#region bd
var cedula;
bd.get('/', (req, res) => {
    res.json({ nombre: uName, token: GenerarToken(uName[0]) });
});

bd.delete('/', async (req, res) => {
    console.log("Borrando registro", req.query.cedula);

    const conexion = bdd.crearConexion(uName, uPass);
    if (!conexion) {
        return res.status(500).json({ error: 'No hay conexión a la base de datos' });
    }

    try {
        await bdd.consultar(conexion,
            'DELETE FROM tb_clientes_prueba WHERE cedula=' + req.query.cedula);
        console.log("Registro Eliminado");
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.send('<script>alert("ERROR: No se pudo borra el registro\n' +
            error + '); window.location.href = "/";</script>');
        res.status(400).send({ error: 'Error en la consulta' });
    } finally {
        conexion.end();
        console.log("Se cerró la conexión en delete/bd")
    }
});

bd.post('/', async (req, res) => {
    console.log("Consiguiendo registro", req.query.cedula);

    const conexion = bdd.crearConexion(uName, uPass);
    if (!conexion) {
        return res.status(500).json({ error: 'No hay conexión a la base de datos' });
    }

    try {
        await bdd.consultar(conexion,
            "SELECT * FROM tb_clientes_prueba " +
            "WHERE cedula='" + req.query.cedula + "'");
        console.log("Registro Encontrado");
        cedula = req.query.cedula;
        res.sendFile(path.resolve(__dirname, 'WebSite/BDDPrueba/clientes.html'));
    } catch (error) {
        console.error(error);
        res.send('<script>alert("ERROR: No se pudo borra el registro\n' +
            error + '); window.location.href = "/";</script>');
        res.status(400).send({ error: 'Error en la consulta' });
    } finally {
        conexion.end();
    }
});

bd.get('/access', async (res, req) => {
    const conexion = bdd.crearConexion(uName, uPass);
    if (!conexion) {
        return res.status(500).json({ error: 'No hay conexión a la base de datos' });
    }

    try {
        const results = await bdd.consultar(conexion, 'SELECT * FROM tb_clientes_prueba');
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

//#region clientes
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
        try {
            await bdd.consultar(conexion,
                "UPDATE tb_clientes_prueba SET" +
                " nombres = '" + registro.nombre + "'," +
                " contraseña = '" + registro.contraseña + "'," +
                " cedula = '" + registro.cedula + "'," +
                " correo = '" + registro.correo + "'," +
                " placa = '" + registro.placa + "'," +
                " tarjeta = '" + registro.tarjeta + "'" +
                " WHERE cedula = '" + registro.current + "'"
            );
            console.log("UPDATE tb_clientes_prueba SET " +
                " nombres = '" + registro.nombre + "', " +
                " contraseña = '" + registro.contraseña + "'," +
                " cedula = '" + registro.cedula + "'," +
                " correo = '" + registro.correo + "'," +
                " placa = '" + registro.placa + "'," +
                " tarjeta = '" + registro.tarjeta + "'," +
                " WHERE cedula = '" + registro.current + "'"
            );
            console.log("Registro dado");
            res.sendFile(path.resolve(__dirname, 'WebSite/BDDPrueba/bdd.html'));
        } catch (error) {
            console.error(error);
            res.send('<script>alert("ERROR: No se pudo modificar el registro\n' +
                error + '); window.location.href = "/";</script>');
            res.status(400).send({ error: 'Error en la consulta' });
        } finally {
            console.log("conexión cerrada en post/clientes")
            conexion.end();
        }
    }
    else {
        try {
            await bdd.consultar(conexion,
                "INSERT INTO tb_clientes_prueba " +
                "(nombres, contraseña, cedula, correo, placa, tarjeta) VALUES (" +
                " '" + registro.nombre + "'," +
                " '" + registro.contraseña + "'," +
                " '" + registro.cedula + "'," +
                " '" + registro.correo + "'," +
                " '" + registro.placa + "'," +
                " '" + registro.tarjeta + "')"
            );
            console.log("INSERT INTO tb_clientes_prueba " +
                "(nombres, contraseña, cedula, correo, placa, tarjeta) VALUES (" +
                " '" + registro.nombre + "'," +
                " '" + registro.contraseña + "'," +
                " '" + registro.cedula + "'," +
                " '" + registro.correo + "'," +
                " '" + registro.placa + "'," +
                " '" + registro.tarjeta + "')"
            );
            console.log("Registro guardado");
            res.sendFile(path.resolve(__dirname, 'WebSite/BDDPrueba/bdd.html'));
        } catch (error) {
            console.error(error);
            res.send('<script>alert("ERROR: No se pudo modificar el registro\n' +
                error + '); window.location.href = "/";</script>');
            res.status(400).send({ error: 'Error en la consulta' });
        } finally {
            console.log("conexión cerrada en post/clientes")
            conexion.end();
        }
    }
})
//#endregion

//#region exportaciones
module.exports = conexion;
//#endregion