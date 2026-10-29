const incomeModel = require('../models').income;

//function of getAllIncome
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

//function of addIncome
exports.addIncome = async (request, response) => {
    try {
        // Get the income data sent by the client.
        const { month, year, budget } = request.body;

        // Check whether all required fields are provided.
        if (!month || !year || budget == null) {
            return response.status(400).json({
                status: false,
                message: 'Bulan, tahun, dan jumlah pemasukan wajib diisi'
            });
        }

        // Check whether the month is valid.
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

        // Check whether year and budget are valid numbers.
        if (
            !Number.isInteger(Number(year)) ||
            Number(year) <= 0 ||
            !Number.isInteger(Number(budget)) ||
            Number(budget) <= 0
        ) {
            return response.status(400).json({
                status: false,
                message: 'Tahun dan jumlah pemasukan harus berupa bilangan bulat positif'
            });
        }

        // Check whether income already exists for this month and year.
        const existingIncome = await incomeModel.findOne({
            where: {
                month: month,
                year: Number(year)
            }
        });

        if (existingIncome) {
            return response.status(400).json({
                status: false,
                message: 'Income untuk bulan dan tahun ini sudah terdaftar.'
            });
        }

        // Save the new income record in the database.
        const newIncome = await incomeModel.create({
            month: month,
            year: Number(year),
            budget: Number(budget)
        });

        // Return the newly created income record.
        return response.status(201).json({
            status: true,
            message: 'Income berhasil ditambahkan',
            data: newIncome
        });

    } catch (error) {
        // Handle unexpected server or database errors.
        return response.status(500).json({
            status: false,
            message: error.message
        });
    }
};
