/*Load library express */
const express = require(`express`)

/*Initiate object that instance of express */
const app = express()

/* allow to read `request` with json type */
app.use(express.json())

/*load income's controller and things that are needed inorder to work */
const budgetController = require(`../controllers/budget.controller`)

/*route to get all budget */
app.get("/", budgetController.getAllBudget)

/*route to get budget by id */
app.get("/:id", budgetController.getBudgetById)

module.exports = app