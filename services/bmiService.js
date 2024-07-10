const bmiModel = require('../models/bmiModel');

// Función para calcular el IMC
const calculateBMI = (height, weight, unit) => {
    if (unit === 'metrico') {
        return weight / (height * height);
    } else if (unit === 'ingles') {
        return (weight / (height * height)) * 703;
    } else {
        throw new Error('Unidad desconocida');
    }
};

// Función para obtener el mensaje según el IMC
const getMessageForBMI = (bmi) => {
    if (bmi < 18.5) {
        return 'Bajo peso';
    } else if (bmi >= 18.5 && bmi < 24.9) {
        return 'Peso normal';
    } else if (bmi >= 25 && bmi < 29.9) {
        return 'Sobrepeso';
    } else {
        return 'Obesidad';
    }
};

// Función para manejar la inserción de datos de IMC en la base de datos
const saveBMIData = (height, weight, unit, callback) => {
    bmiModel.insertBMI(height, weight, unit, callback);
};

// Función para obtener todos los registros de IMC
const getAllBMIData = (callback) => {
    bmiModel.getAllBMI(callback);
};

module.exports = {
    calculateBMI,
    getMessageForBMI,
    saveBMIData,
    getAllBMIData
};
