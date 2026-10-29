const incomeModel = require('../models').income;

exports.getAllIncome = async (request, response) => {
  try {
    // Retrieve all income records from the database.
    const income = await incomeModel.findAll();

    // Return the retrieved records to the client.
    return response.status(200).json({
      status: true,
      data: income
    });
  } catch (error) {
    // Handle errors that occur while retrieving income.
    return response.status(500).json({
      status: false,
      message: error.message
    });
  }
};
