const { json } = require('body-parser');
const mysql = require('mysql');

const conexion = mysql.createConnection({
    host: 'localhost',
    database: 'db_proyecto_final',
    user: "root",
    password: ""
});

function Conectar() {
    return new Promise((resolve, reject) => {
        conexion.connect((error) => {
            if (error) {
                return reject(error);
            }
            resolve(conexion);
        });
    });
}

function Consultar(query) {
    return new Promise((resolve, reject) => {
        conexion.query(query, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

async function BorrarRegistro(cedula) {
    try {
        await Consultar("DELETE FROM tb_clientes WHERE cedula='" + cedula + "'");
        console.log("Registro Eliminado");
        conexion.end();
        return true;
    } catch (error) {
        console.error(error);
        conexion.end();
        return false;
    }
}

async function ConseguirRegistros(idCliente) {
    try {
        const query = "SELECT * FROM tb_clientes WHERE idCliente = ?";
        const registro = await Consultar(mysql.format(query, [idCliente]));
        console.log("Enviando resultado");
        if (registro.length === 0) return null;
        return registro;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function ModificarRegistro(registro) {
    try {
        await Consultar("UPDATE tb_clientes SET" +
            " nombres = '" + registro.nombre + "'," +
            " contraseña = '" + registro.contraseña + "'," +
            " cedula = '" + registro.cedula + "'," +
            " correo = '" + registro.correo + "'," +
            " placa = '" + registro.placa + "'," +
            " tarjeta = '" + registro.tarjeta + "'" +
            " saldo = '" + parseFloat(registro.tarjeta) + "'" +
            " WHERE cedula = '" + registro.current + "'"
        );
        console.log("Registro actualizado");
        return true;
    } catch (error) {
        console.error(error);
        conexion.end();
        return false;
    }
}

async function InsertarRegistro(registro) {
    try {
        await Consultar("INSERT INTO tb_clientes " +
            "(nombres, contraseña, cedula, correo, placa, tarjeta) VALUES (" +
            " '" + registro.nombre + "'," +
            " '" + registro.contraseña + "'," +
            " '" + registro.cedula + "'," +
            " '" + registro.correo + "'," +
            " '" + registro.placa + "'," +
            " '" + registro.placa + "'," +
            " '" + parseFloat(registro.saldo) + "')"
        );
        console.log("IRegistro ingresado");
        conexion.end();
        return true;
    } catch (error) {
        console.error(error);
        conexion.end();
        return false;
    }
}
module.exports = { conexion, BorrarRegistro, ConseguirRegistros, ModificarRegistro, InsertarRegistro };

