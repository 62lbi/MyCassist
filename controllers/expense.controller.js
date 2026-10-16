
/* Load the models needed by the expense controller */
const models = require('../models');
const expenseModel = models.expense;
const incomeModel = models.income;
const budgetModel = models.budget;

/* Create a function to get all recorded expenses */
exports.getAllExpense = async (request, response) => {
    try {
        // Get all expense records from the database
        const expense = await expenseModel.findAll();

        return response.status(200).json({
            status: true,
            data: expense
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: 'Terjadi kesalahan server'
        });
    }
};

/* Create a function to add an expense */
exports.addExpense = async (request, response) => {
    try {
        // Get expense data from the request body
        const { month, year, category, description, price } = request.body;

        // Define valid months
        const validMonths = [
            'January', 'February', 'March', 'April',
            'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December'
        ];

        // Define valid expense categories
        const validCategories = [
            'entertainment', 'foodNeeds', 'miscellaneous'
        ];

        // Validate all expense inputs
        if (
            !validMonths.includes(month) ||
            !Number.isInteger(year) ||
            year < 1 ||
            !validCategories.includes(category) ||
            typeof description !== 'string' ||
            !description.trim() ||
            !Number.isInteger(price) ||
            price <= 0
        ) {
            return response.status(400).json({
                status: false,
                message: 'Input expense tidak valid'
            });
        }

        // Find income using both month and year
        const income = await incomeModel.findOne({
            where: {
                month: month,
                year: year
            }
        });

        // Check whether the income record exists
        if (!income) {
            return response.status(404).json({
                status: false,
                message: 'Income untuk bulan dan tahun tersebut belum tersedia'
            });
        }

        // Find the budget connected to the income
        const budget = await budgetModel.findOne({
            where: {
                incomeID: income.incomeID
            }
        });

        // Check whether the budget exists
        if (!budget) {
            return response.status(404).json({
                status: false,
                message: 'Budget untuk income tersebut belum tersedia'
            });
        }

        // Create the expense and connect it to the budget
        const expense = await expenseModel.create({
            budgetID: budget.budgetID,
            category: category,
            description: description.trim(),
            price: price
        });

        // Prepare the response data
        const data = {
            id: expense.expenseID,
            budgetID: expense.budgetID,
            month: income.month,
            year: income.year,
            category: expense.category,
            description: expense.description,
            price: expense.price
        };

        // Return the successful response
        return response.status(201).json({
            status: true,
            message: 'Expense berhasil ditambahkan',
            data: data
        });

    } catch (error) {
        // Display the error in the server terminal
        console.error(error);

        // Handle server errors
        return response.status(500).json({
            status: false,
            message: 'Terjadi kesalahan server'
        });
    }
};
