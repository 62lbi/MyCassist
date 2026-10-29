const expenseModel = require('../models').expense;

// Function to retrieve all expense records.
exports.getAllExpense = async (request, response) => {
    try {
        // 1. Retrieve all expense records from the database.
        const expenses = await expenseModel.findAll();

        // 2. Return the retrieved records to the client.
        return response.status(200).json({
            status: true,
            data: expenses
        });

    } catch (error) {
        // 3. Handle unexpected errors.
        return response.status(500).json({
            status: false,
            message: error.message
        });
    }
};
