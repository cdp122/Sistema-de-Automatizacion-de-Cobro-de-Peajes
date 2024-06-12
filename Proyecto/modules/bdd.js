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

async function BorrarRegistro(tabla, parametro, valor) {
    try {
        const query = "DELETE FROM " + tabla + " WHERE " +
            parametro + " = '" + valor + "'";
        await Consultar(query);
        console.log("Registro Eliminado");
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

//#region Conseguir Registros
async function ConseguirRegistros(tabla, nombreParametro, parametroBusqueda) {
    try {
        const query = "SELECT * FROM " + tabla + " WHERE " + nombreParametro + " = ?";
        const registro = await Consultar(mysql.format(query, [parametroBusqueda]));
        if (registro.length === 0) return null;
        console.log("Enviando resultado");
        return registro;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function LogInClient(idCliente) {
    return await ConseguirRegistros("tb_clientes", "idCliente", idCliente);
}

async function LogInEmpleado(idEmpleado) {
    return await ConseguirRegistros("tb_empleados", "idEmpleado", idEmpleado);
}

async function RecibirDatos(idCliente) {
    return await ConseguirRegistros("tb_clientes", "idCliente", idCliente);
}
//#endregion

async function ModificarRegistro(tabla, nuevoParam, actual, paramTarg, target) {
    try {
        const query = "UPDATE " + tabla + " SET " + nuevoParam + " = " + actual +
            " WHERE " + paramTarg + " = '" + target + "'";
        console.log(query);
        const registro = await Consultar(query);
        if (registro.length === 0) return null;
        console.log("Enviando resultado");
        return registro;
    } catch (error) {
        console.error(error);
        return null;
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
module.exports = {
    conexion, BorrarRegistro, ConseguirRegistros, LogInClient, LogInEmpleado,
    RecibirDatos, ModificarRegistro, InsertarRegistro
};

