const db = require('../db');

// Función para insertar datos en la tabla de IMC
const insertBMI = (height, weight, unit, callback) => {
    const query = 'INSERT INTO imc_data (height, weight, unit) VALUES (?, ?, ?)';
    db.query(query, [height, weight, unit], callback);
};

// Función para obtener todos los registros de la tabla de IMC
const getAllBMI = (callback) => {
    const query = 'SELECT * FROM imc_data';
    db.query(query, callback);
};

module.exports = {
    insertBMI,
    getAllBMI
};
