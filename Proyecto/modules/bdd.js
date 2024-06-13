//#region Instanciación de la bdd
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

//#endregion

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

async function InsertarRegistro(tabla, params, values) {
    var query = "INSERT INTO " + tabla + " (";
    if (params.length != values.length) return false;
    params.forEach(parametro => {
        query += "" + parametro + ", ";
    });
    query = query.slice(0, - 2) + ") VALUES (";
    values.forEach(valor => {
        if (valor !== "current_timestamp()") {
            query += "'" + valor + "', ";
        } else {
            query += "current_timestamp(), ";
        }
    });
    query = query.slice(0, - 2) + ")";
    try {
        await Consultar(query);
        console.log("Registro ingresado");
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function ModificarRegistro(tabla, nuevoParam, actual, paramTarg, target) {
    try {
        const query = "UPDATE " + tabla + " SET " + nuevoParam + " = '" + actual +
            "' WHERE " + paramTarg + " = '" + target + "'";
        const registro = await Consultar(query);
        if (registro.length === 0) return null;
        console.log("Enviando resultado");
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function ModificarRegistros(tabla, params, nuevosValores, paramTarg, target) {
    if (params.length != nuevosValores.length) return false;

    var query = "UPDATE " + tabla + " SET ";
    for (let i = 0; i < params.length; i++) {
        query += params[i] + " = '" + nuevosValores[i] + "', ";
    }
    query = query.slice(0, - 2) + " WHERE " + paramTarg + " = '" + target + "'";

    try {
        await Consultar(query);
        console.log("Registros modificados exitosamente");
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
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

module.exports = {
    conexion, BorrarRegistro, ConseguirRegistros, LogInClient, LogInEmpleado,
    RecibirDatos, ModificarRegistro, ModificarRegistros, InsertarRegistro
};

