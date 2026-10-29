const incomeModel = require('../models').income
const budgetModel = require('../models').budget

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
                message: 'Bulan, tahun, dan semua persentase wajib diisi'
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

        // 5. Make sure all percentages are valid numbers.
        const percentages = [entertainment, foodNeeds, miscellaneous];

        if (
            percentages.some(value =>
                typeof value !== 'number' ||
                !Number.isFinite(value) ||
                value < 0 ||
                value > 100
            )
        ) {
            return response.status(400).json({
                status: false,
                message: 'Setiap persentase harus berupa angka antara 0 dan 100'
            });
        }

        // 6. Check whether the percentages add up to exactly 100.
        const totalPercentage =
            entertainment + foodNeeds + miscellaneous;

        if (totalPercentage !== 100) {
            return response.status(400).json({
                status: false,
                message: 'Total persentase harus tepat 100'
            });
        }

        // 7. Find the income for the requested month and year.
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

        // 8. Check whether this income already has a budget allocation.
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

        // 9. Save the percentages in the database.
        const newBudget = await budgetModel.create({
            incomeID: income.incomeID,
            entertainment: entertainment,
            foodNeeds: foodNeeds,
            miscellaneous: miscellaneous
        });

        // 10. Calculate the money allocated to each category.
        const totalIncome = income.budget;

        // Round to the nearest whole rupiah.
        const entertainmentAmount =
            Math.round(totalIncome * entertainment / 100);

        const foodNeedsAmount =
            Math.round(totalIncome * foodNeeds / 100);

        const miscellaneousAmount =
            Math.round(totalIncome * miscellaneous / 100);

        // 11. Return the budget allocation and calculated amounts.
        return response.status(201).json({
            status: true,
            message: 'Budget berhasil dibuat',
            data: {
                budgetID: newBudget.budgetID,
                incomeID: income.incomeID,
                month: income.month,
                year: income.year,
                budget: totalIncome,
                entertainment: {
                    percentage: entertainment,
                    amount: entertainmentAmount
                },
                foodNeeds: {
                    percentage: foodNeeds,
                    amount: foodNeedsAmount
                },
                miscellaneous: {
                    percentage: miscellaneous,
                    amount: miscellaneousAmount
                }
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

            // Return the budget details and calculated amounts.
            return {
                budgetID: item.budgetID,
                incomeID: item.incomeID,
                month: item.income.month,
                year: item.income.year,
                budget: totalIncome,

                entertainment: {
                    percentage: item.entertainment,
                    amount: Math.round(
                        totalIncome * item.entertainment / 100
                    )
                },

                foodNeeds: {
                    percentage: item.foodNeeds,
                    amount: Math.round(
                        totalIncome * item.foodNeeds / 100
                    )
                },

                miscellaneous: {
                    percentage: item.miscellaneous,
                    amount: Math.round(
                        totalIncome * item.miscellaneous / 100
                    )
                }
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
        // 1. Get the budgetID from the URL.
        const { id } = request.params;

        // 2. Get the new percentages from the request body.
        const { entertainment, foodNeeds, miscellaneous } = request.body;

        // 3. Check whether all percentages are provided.
        if (
            entertainment == null ||
            foodNeeds == null ||
            miscellaneous == null
        ) {
            return response.status(400).json({
                status: false,
                message: 'Semua persentase wajib diisi'
            });
        }

        // 4. Validate that all percentages are numbers between 0 and 100.
        const percentages = [entertainment, foodNeeds, miscellaneous];

        if (
            percentages.some(value =>
                typeof value !== 'number' ||
                !Number.isFinite(value) ||
                value < 0 ||
                value > 100
            )
        ) {
            return response.status(400).json({
                status: false,
                message: 'Setiap persentase harus berupa angka antara 0 dan 100'
            });
        }

        // 5. Check whether the percentages add up to exactly 100.
        const totalPercentage =
            entertainment + foodNeeds + miscellaneous;

        if (totalPercentage !== 100) {
            return response.status(400).json({
                status: false,
                message: 'Total persentase harus tepat 100'
            });
        }

        // 6. Find the budget using its ID.
        const budget = await budgetModel.findByPk(id, {
            include: [{
                model: incomeModel,
                as: 'income'
            }]
        });

        // Return 404 if the budget does not exist.
        if (!budget) {
            return response.status(404).json({
                status: false,
                message: 'Data budget tidak ditemukan'
            });
        }

        // 7. Update the percentages stored in the database.
        await budget.update({
            entertainment: entertainment,
            foodNeeds: foodNeeds,
            miscellaneous: miscellaneous
        });

        // 8. Get the total income linked to this budget.
        const totalIncome = budget.income.budget;

        // 9. Return the updated percentages and calculated amounts.
        return response.status(200).json({
            status: true,
            message: 'Budget berhasil diubah',
            data: {
                budgetID: budget.budgetID,
                incomeID: budget.incomeID,
                month: budget.income.month,
                year: budget.income.year,
                budget: totalIncome,

                entertainment: {
                    percentage: budget.entertainment,
                    amount: Math.round(
                        totalIncome * budget.entertainment / 100
                    )
                },

                foodNeeds: {
                    percentage: budget.foodNeeds,
                    amount: Math.round(
                        totalIncome * budget.foodNeeds / 100
                    )
                },

                miscellaneous: {
                    percentage: budget.miscellaneous,
                    amount: Math.round(
                        totalIncome * budget.miscellaneous / 100
                    )
                }
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

