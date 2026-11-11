//load library from express
const express = require('express')

//initiate object that instance of express
const router = express.Router()

//load saving's controlller
const savingController = require(`../controllers/saving.controller`)

//use routes to refer the functions from controller
router.get(`/`, savingController.getAllSaving)

module.exports = router;