const bmiService = require('../services/bmiService');

const calculateAndSaveBMI = (req, res) => {
    const { height, weight, unit } = req.body;
    try {
        const bmi = bmiService.calculateBMI(height, weight, unit);
        const message = bmiService.getMessageForBMI(bmi);
        bmiService.saveBMIData(height, weight, unit, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error al guardar los datos');
            }
            res.status(201).json({ bmi: bmi.toFixed(2), message });
        });
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

const getAllBMI = (req, res) => {
    bmiService.getAllBMIData((err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al obtener los datos');
        }
        res.status(200).json(results);
    });
};

module.exports = {
    calculateAndSaveBMI,
    getAllBMI
};

