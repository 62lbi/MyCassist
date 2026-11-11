
const savingModel = require('../models').saving;
const budgetModel = require('../models').budget;
const incomeModel = require('../models').income;


//function to get all saving
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

// function of get saving by its ID
exports.getSavingById = async (request, response) => {
    try {
        // 1. Get the saving ID from the URL parameter.
        const { id } = request.params;

        // 2. Find the saving record and its related budget and income.
        const saving = await savingModel.findByPk(id, {
            include: [{
                model: budgetModel,
                as: 'budget',
                include: [{
                    model: incomeModel,
                    as: 'income'
                }]
            }]
        });

        // 3. Check whether the saving record exists.
        if (!saving) {
            return response.status(404).json({
                status: false,
                message: "Data saving tidak ditemukan"
            });
        }

        // 4. Return the requested saving record.
        return response.status(200).json({
            status: true,
            data: {
                savingID: saving.savingID,
                budgetID: saving.budgetID,
                month: saving.budget.income.month,
                year: saving.budget.income.year,
                savingMoney: saving.savingMoney
            }
        });

    } catch (error) {
        // Handle unexpected server errors.
        return response.status(500).json({
            status: false,
            message: error.message
        });
    }
};

