const mysql = require('mysql');

const conexion = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    database: 'db_proyecto_final',
    user: "root",
    password: ""
});

function Conectar() {
    return new Promise((resolve, reject) => {
        conexion.getConnection((error) => {
            if (error) {
                return reject(error);
            }
            resolve(conexion);
        });
    });
}

function Consultar(query) {
    Conectar();
    return new Promise((resolve, reject) => {
        conexion.query(query, (error, results, fields) => {
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

async function ConseguirRegistros(cedula) {
    try {
        const query = "SELECT * FROM tb_clientes " +
            "WHERE cedula=?";
        const registro = await Consultar(query, [cedula]);
        console.log("Registro Encontrado");
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

