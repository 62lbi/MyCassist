const expenseModel = require('../models').expense;
const budgetModel = require('../models').budget;
const incomeModel = require('../models').income;

// Function to retrieve all expense records.
exports.getAllExpense = async (request, response) => {
    try {
        // 1. Retrieve all expense records from the database.
        const expenses = await expenseModel.findAll({
            include: [
                {
                    model: budgetModel,
                    as: 'budget',
                    include: [
                        {
                            model: incomeModel,
                            as: 'income'
                        }
                    ]
                }
            ]
        });

        const formattedExpenses = expenses.map((expense) => {
            return {
                expenseID: expense.expenseID,
                budgetID: expense.budgetID,
                month: expense.budget.income.month,
                year: expense.budget.income.year,
                category: expense.category,
                description: expense.description,
                price: expense.price
            };
        });

        // 2. Return the retrieved records to the client.
        return response.status(200).json({
            status: true,
            data: formattedExpenses
        });

    } catch (error) {
        // 3. Handle unexpected errors.
        return response.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Function to create a new expense record.
exports.addExpense = async (request, response) => {
    try {
        // 1. Get the expense data sent by the user.
        const { month, year, category, description, price } = request.body;

        // 2. Check whether all required fields are provided.
        if (
            !month ||
            year == null ||
            !category ||
            !description ||
            price == null
        ) {
            return response.status(400).json({
                status: false,
                message: 'Semua data expense wajib diisi'
            });
        }

        // 3. Validate the month.
        const validMonths = [
            'January', 'February', 'March', 'April',
            'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December'
        ];

        if (!validMonths.includes(month)) {
            return response.status(400).json({
                status: false,
                message: 'Bulan tidak valid'
            });
        }

        // 4. Validate the year.
        if (
            !Number.isInteger(Number(year)) ||
            Number(year) <= 0
        ) {
            return response.status(400).json({
                status: false,
                message: 'Tahun harus berupa bilangan bulat positif'
            });
        }

        // 5. Validate the expense category.
        const validCategories = [
            'entertainment',
            'foodNeeds',
            'miscellaneous'
        ];

        if (!validCategories.includes(category)) {
            return response.status(400).json({
                status: false,
                message: 'Kategori expense tidak valid'
            });
        }

        // 6. Validate the description.
        if (
            typeof description !== 'string' ||
            description.trim() === ''
        ) {
            return response.status(400).json({
                status: false,
                message: 'Deskripsi expense tidak boleh kosong'
            });
        }

        // 7. Validate the expense price.
        if (
            typeof price !== 'number' ||
            !Number.isInteger(price) ||
            price <= 0
        ) {
            return response.status(400).json({
                status: false,
                message: 'Harga expense harus berupa bilangan bulat positif'
            });
        }

        // 8. Find the income using the requested month and year.
        const income = await incomeModel.findOne({
            where: {
                month: month,
                year: Number(year)
            }
        });

        // Return 404 if the income does not exist.
        if (!income) {
            return response.status(404).json({
                status: false,
                message: 'Data income untuk bulan dan tahun tersebut tidak ditemukan'
            });
        }

        // 9. Find the budget linked to the income.
        const budget = await budgetModel.findOne({
            where: {
                incomeID: income.incomeID
            }
        });

        // Return 404 if the budget does not exist.
        if (!budget) {
            return response.status(404).json({
                status: false,
                message: 'Alokasi budget untuk income tersebut belum tersedia'
            });
        }

        // 10. Create the expense using the retrieved budgetID.
        const newExpense = await expenseModel.create({
            budgetID: budget.budgetID,
            category: category,
            description: description.trim(),
            price: price
        });

        // 11. Return the newly created expense.
        return response.status(201).json({
            status: true,
            message: 'Expense berhasil ditambahkan',
            data: {
                expenseID: newExpense.expenseID,
                budgetID: newExpense.budgetID,
                month: income.month,
                year: income.year,
                category: newExpense.category,
                description: newExpense.description,
                price: newExpense.price
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
