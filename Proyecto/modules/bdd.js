const mysql = require('mysql');

function crearConexion(username, password) {
    return mysql.createConnection({
        host: 'localhost',
        database: 'db_proyecto_final',
        user: username,
        password: password
    });
}

function conectar(conexion) {
    return new Promise((resolve, reject) => {
        conexion.connect((error) => {
            if (error) {
                return reject(error);
            }
            resolve(conexion);
        });
    });
}

function consultar(conexion, query) {
    return new Promise((resolve, reject) => {
        conexion.query(query, (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

module.exports = { crearConexion, conectar, consultar };

