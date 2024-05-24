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
        await Consultar("DELETE FROM tb_clientes_prueba WHERE cedula='" + cedula + "'");
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
        await Consultar("SELECT * FROM tb_clientes_prueba " +
            "WHERE cedula='" + cedula + "'");
        console.log("Registro Encontrado");
        conexion.end();
        return true;
    } catch (error) {
        console.error(error);
        conexion.end();
        return false;
    }
}

async function ModificarRegistro(registro) {
    try {
        await Consultar("UPDATE tb_clientes_prueba SET" +
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
        return true;
    } catch (error) {
        console.error(error);
        conexion.end();
        return false;
    }
}

async function InsertarRegistro(registro) {
    try {
        await Consultar("INSERT INTO tb_clientes_prueba " +
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
        conexion.end();
        return true;
    } catch (error) {
        console.error(error);
        conexion.end();
        return false;
    }
}
module.exports = { conexion, BorrarRegistro, ConseguirRegistros, ModificarRegistro, InsertarRegistro };

