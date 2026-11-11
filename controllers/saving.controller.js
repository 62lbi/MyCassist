
const savingModel = require('../models').saving;
const budgetModel = require('../models').budget;
const incomeModel = require('../models').income;


// GET ALL SAVING
exports.getAllSaving = async (request, response) => {
    try {
        // 1. Retrieve all saving records and their related budget and income.
        const savings = await savingModel.findAll({
            include: [{
                model: budgetModel,
                as: 'budget',
                include: [{
                    model: incomeModel,
                    as: 'income'
                }]
            }]
        });

        // 2. Convert the retrieved records into the response format.
        const data = savings.map((item) => {
            return {
                savingID: item.savingID,
                budgetID: item.budgetID,
                month: item.budget.income.month,
                year: item.budget.income.year,
                savingMoney: item.savingMoney
            };
        });

        // 3. Return all saving records.
        return response.status(200).json({
            status: true,
            data: data
        });

    } catch (error) {
        // Handle unexpected server errors.
        return response.status(500).json({
            status: false,
            message: error.message
        });
    }
};

