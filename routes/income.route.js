/*Load library express */
const express = require(`express`)

/*Initiate object that instance of express */
const app = express()

/* allow to read `request` with json type */
app.use(express.json())

/*load income's controller and things that are needed inorder to work */
const incomeController = require(`../controllers/income.controller`)

/*create route to GET all data of income.*/
app.get("/", incomeController.getAllIncome)
app.post("/", incomeController.addIncome)

module.exports = app