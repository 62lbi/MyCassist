// load library from express 
const express = require ('express')

//initiate object that instance of express
const router = express.Router()

//load income's controller
const budgetController = require('../controllers/budget.controller')

//use the routes to refer the functions from controller
router.post('/', budgetController.addBudget)
router.get('/', budgetController.getAllBudget)
router.put('/:id', budgetController.updateBudget)
router.delete('/:id', budgetController.deleteBudget)

module.exports = router; //hello future me, something new i learnt is the usage of 'router'. i usually use app in routes but now i learnt that index.js should use 'app' and for routes is router (For readability)