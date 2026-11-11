const incomeModel = require('../models').income
const budgetModel = require('../models').budget
const expenseModel = require('../models').expense
const savingModel = require('../models').saving

// Function to create a budget allocation

exports.addBudget = async (request, response) => {
    try {
        // 1. Get the data sent by the user.
        const { month, year, entertainment, foodNeeds, miscellaneous } = request.body;

        // 2. Check whether all required fields are provided.
        if (
            !month ||
            year == null ||
            entertainment == null ||
            foodNeeds == null ||
            miscellaneous == null
        ) {
            return response.status(400).json({
                status: false,
                message: 'Bulan, tahun, dan semua nominal budget wajib diisi'
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

        // 4. Check whether the year is a positive integer.
        if (
            !Number.isInteger(Number(year)) ||
            Number(year) <= 0
        ) {
            return response.status(400).json({
                status: false,
                message: 'Tahun harus berupa bilangan bulat positif'
            });
        }

        // 5. Validate that all budget amounts are non-negative integers.
        const budgetAmounts = [
            entertainment,
            foodNeeds,
            miscellaneous
        ];

        if (
            budgetAmounts.some(value =>
                typeof value !== 'number' ||
                !Number.isSafeInteger(value) ||
                value < 0
            )
        ) {
            return response.status(400).json({
                status: false,
                message: 'Setiap nominal budget harus berupa bilangan bulat positif atau nol'
            });
        }

        // 6. Find the income for the requested month and year.
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

        // 7. Calculate the total allocated budget.
        const totalBudget =
            entertainment +
            foodNeeds +
            miscellaneous;

        // 8. Make sure the total budget does not exceed the income.
        if (totalBudget > income.budget) {
            return response.status(400).json({
                status: false,
                message: 'Total alokasi budget tidak boleh melebihi income'
            });
        }

        // 9. Check whether this income already has a budget allocation.
        const existingBudget = await budgetModel.findOne({
            where: {
                incomeID: income.incomeID
            }
        });

        if (existingBudget) {
            return response.status(400).json({
                status: false,
                message: 'Alokasi budget untuk income ini sudah tersedia'
            });
        }

        // 10. Calculate the remaining money.
        const remainingMoney = income.budget - totalBudget;

        // 11. Save the nominal budget amounts in the database.
        const newBudget = await budgetModel.create({
            incomeID: income.incomeID,
            entertainment: entertainment,
            foodNeeds: foodNeeds,
            miscellaneous: miscellaneous
        });

        // 12. Save the remaining money as a saving record.
        await savingModel.create({
            budgetID: newBudget.budgetID,
            savingMoney: remainingMoney
        });

        // 13. Return the budget allocation and remaining money.
        return response.status(201).json({
            status: true,
            message: 'Budget berhasil dibuat',
            data: {
                budgetID: newBudget.budgetID,
                incomeID: income.incomeID,
                month: income.month,
                year: income.year,
                totalIncome: income.budget,
                totalBudget: totalBudget,
                entertainment: entertainment,
                foodNeeds: foodNeeds,
                miscellaneous: miscellaneous,
                remainingMoney: remainingMoney
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


// Function to getAllBudget
exports.getAllBudget = async (request, response) => {
    try {
        // 1. Retrieve all budget records and their related income.
        const budgets = await budgetModel.findAll({
            include: [{
                model: incomeModel,
                as: 'income'
            }]
        });

        // 2. Convert each budget record into the response format.
        const data = budgets.map((item) => {

            // Get the total income linked to this budget.
            const totalIncome = item.income.budget;

            // Calculate the total allocated budget.
            const totalBudget =
                item.entertainment +
                item.foodNeeds +
                item.miscellaneous;

            // Calculate the remaining money.
            const remainingMoney = totalIncome - totalBudget;

            // Return the budget details and calculated amounts.
            return {
                budgetID: item.budgetID,
                incomeID: item.incomeID,
                month: item.income.month,
                year: item.income.year,
                totalIncome: totalIncome,
                totalBudget: totalBudget,
                entertainment: item.entertainment,
                foodNeeds: item.foodNeeds,
                miscellaneous: item.miscellaneous,
                remainingMoney: remainingMoney
            };
        });

        // 3. Return all budget allocations.
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


//Function to updateBudget

exports.updateBudget = async (request, response) => {
    try {
        // 1. Get the budget ID from the URL parameter.
        const { id } = request.params;

        // 2. Get the updated budget amounts from the request body.
        const { entertainment, foodNeeds, miscellaneous } = request.body;

        // 3. Validate that all required fields are provided.
        if (
            entertainment == null ||
            foodNeeds == null ||
            miscellaneous == null
        ) {
            return response.status(400).json({
                status: false,
                message: "Semua kategori budget harus diisi"
            });
        }

        // 4. Validate that all budget amounts are non-negative integers.
        const amounts = [entertainment, foodNeeds, miscellaneous];

        const validAmounts = amounts.every((amount) =>
            typeof amount === 'number' &&
            Number.isSafeInteger(amount) &&
            amount >= 0
        );

        if (!validAmounts) {
            return response.status(400).json({
                status: false,
                message: "Jumlah budget harus berupa angka bulat dan tidak boleh negatif"
            });
        }

        // 5. Find the budget record and its related income.
        const budget = await budgetModel.findByPk(id, {
            include: [{
                model: incomeModel,
                as: 'income'
            }]
        });

        if (!budget) {
            return response.status(404).json({
                status: false,
                message: "Data budget tidak ditemukan"
            });
        }

        // 6. Get the total income linked to this budget.
        const totalIncome = budget.income.budget;

        // 7. Calculate the total updated budget allocation.
        const totalBudget =
            entertainment +
            foodNeeds +
            miscellaneous;

        // 8. Make sure the allocated budget does not exceed the income.
        if (totalBudget > totalIncome) {
            return response.status(400).json({
                status: false,
                message: "Total budget tidak boleh melebihi pemasukan"
            });
        }

        // 9. Update the budget amounts in the database.
        await budget.update({
            entertainment: entertainment,
            foodNeeds: foodNeeds,
            miscellaneous: miscellaneous
        });

        // 10. Find the saving record associated with this budget.
        const saving = await savingModel.findOne({
            where: {
                budgetID: budget.budgetID
            }
        });

        // 11. Update the existing saving record.
        if (saving) {
            await saving.update({
                savingMoney: remainingMoney
            });
        }

        // 12. Calculate the remaining unallocated money.
        const remainingMoney = totalIncome - totalBudget;

        // 13. Return the updated budget data.
        return response.status(200).json({
            status: true,
            message: "Budget berhasil diperbarui",
            data: {
                budgetID: budget.budgetID,
                incomeID: budget.incomeID,
                month: budget.income.month,
                year: budget.income.year,
                totalIncome: totalIncome,
                totalBudget: totalBudget,
                entertainment: entertainment,
                foodNeeds: foodNeeds,
                miscellaneous: miscellaneous,
                remainingMoney: remainingMoney
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

//function to deleteBudget
exports.deleteBudget = async (request, response) => {
    try {
        // 1. Get the budgetID from the URL.
        const { id } = request.params;

        // 2. Find the budget record.
        const budget = await budgetModel.findByPk(id);

        // 3. Return 404 if the budget does not exist.
        if (!budget) {
            return response.status(404).json({
                status: false,
                message: 'Data budget tidak ditemukan'
            });
        }

        // 4. Delete the budget record.
        await budget.destroy();

        // 5. Return a success response.
        return response.status(200).json({
            status: true,
            message: 'Budget berhasil dihapus'
        });

    } catch (error) {
        // Handle unexpected server errors.
        return response.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// GET budget status by budget ID
exports.getBudgetStatus = async (request, response) => {
    try {
        // 1. Get the budget ID from the URL.
        const id = request.params.id;

        // 2. Find the budget and its related income.
        const budget = await budgetModel.findByPk(id, {
            include: [{
                model: incomeModel,
                as: 'income'
            }]
        });

        // 3. Check whether the budget exists.
        if (!budget) {
            return response.status(404).json({
                status: false,
                message: 'Data budget tidak ditemukan'
            });
        }

        // 4. Calculate the total expense linked to this budget.
        const totalExpense = await expenseModel.sum('price', {
            where: {
                budgetID: budget.budgetID
            }
        }) || 0;

        // 5. Calculate the remaining money.
        const totalIncome = budget.income.budget;
        const remaining = totalIncome - totalExpense;

        // 6. Calculate the remaining percentage.
        const remainingPercentage = (remaining / totalIncome) * 100;

        // 7. Determine the financial status.
        let financialStatus;

        if (remaining < 0) {
            financialStatus = 'Over Budget';
        } else if (remainingPercentage > 25) {
            financialStatus = 'Safe';
        } else {
            financialStatus = 'Warning';
        }

        // 8. Return the budget status.
        return response.status(200).json({
            status: true,
            data: {
                budgetID: budget.budgetID,
                month: budget.income.month,
                year: budget.income.year,
                totalIncome: totalIncome,
                totalExpense: totalExpense,
                remaining: remaining,
                remainingPercentage: Number(remainingPercentage.toFixed(2)),
                financialStatus: financialStatus
            }
        });

    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        });
    }
};

