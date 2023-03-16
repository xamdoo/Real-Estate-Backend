const express = require('express')
const router =  express.Router()

const UserController = require("../Controllers/UserController")


router.post('/register', UserController.registerUser)
router.post('/login', UserController.loginUser)
router.get('/savedProperties/:id', UserController.savedProperties)
router.get('/viewedProperties/:id', UserController.viewedProperties)


module.exports = router