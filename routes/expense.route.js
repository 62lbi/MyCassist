/*load library express */
const express = require(`express`)

/*Initiate object that instance of express */
const app = express()

/* allow to read `request` with json type */
app.use(express.json())

/*load expense's controller and things that are needed inorder to work */
const expenseController = require(`../controllers/expense.controller`)

/*route to get all data of expense */
app.get("/", expenseController.getAllExpense)

module.exports = app