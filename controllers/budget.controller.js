/* Load the models needed by the budget controller */
const models = require('../models');
const budgetModel = models.budget;
const incomeModel = models.income;

/*create function to get all existing budget */
exports.getAllBudget = async (request, response) => {
    try {
        // Retrieve all budget records from the database
        const budgets = await budgetModel.findAll();

        // Return all budgets
        return response.status(200).json({
            status: true,
            message: 'Data budget berhasil diambil',
            data: budgets
        });

    } catch (error) {
        // Display the actual error in the server terminal
        console.error(error);

        return response.status(500).json({
            status: false,
            message: 'Terjadi kesalahan server'
        });
    }
};