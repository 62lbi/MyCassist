const express = require('express');

// Create the main Express application.
const app = express();

// Allow the application to read JSON request bodies.
app.use(express.json());

// Load income routes.
const incomeRoute = require('./routes/income.route');
const budgetRoute = require('./routes/budget.route');
const expenseRoute = require('./routes/expense.route')

// Connect income routes to the /income path.
app.use('/income', incomeRoute);
app.use('/budget', budgetRoute);
app.use('/expense', expenseRoute);

// Set the port number for the server.
const PORT = 3433;

// Start the server.
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
