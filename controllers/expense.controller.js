/*load model for `expense` table */
const expenseModel = require(`../models`).expense

/*creating function to get all recorded data of expense in the database*/
exports.getAllExpense = async (request, response) => {
    try {
        /*get all of the recorded data in the database of expense */
        const expense = await expenseModel.findAll()
        return response.status(200).json({
            status: true,
            data: expense
        })
    } catch(error) {
        return response.status(500).json({
            status: false,
            message: `Terjadi kesalahan server`
        })
    }
}

