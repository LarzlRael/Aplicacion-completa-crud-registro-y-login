const mysql = require('mysql');
const { promisify } = require('util')

const { db_connection } = require('./keys');

const pool = mysql.createPool(db_connection)

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {
            console.error('La conexion con la base de datos fue cerrada');
        }
        if (err.code == 'ER_CON_COUNT_ERROR ') {
            console.error('la base de datos tiene muchas conexiones');
        }
        if (err.code == 'ECONNREFUSED ') {
            console.error('la conexion fue rechazada');
        }
    }
    if (connection) {
        connection.release();
        console.log("la base de datos esta conectada");
        return;

    }
})
pool.query = promisify(pool.query);
module.exports = pool;
