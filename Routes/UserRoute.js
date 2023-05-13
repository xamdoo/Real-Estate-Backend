const express = require("express");
const router = express.Router();


const UserController = require("../Controllers/UserController");


router.post('/register', UserController.registerUser)
router.post('/login', UserController.loginUser)
router.post('/savedProperties', UserController.savedProperties)
router.post('/viewedProperties', UserController.viewedProperties)
router.delete('/viewedProperties', UserController.deleteViewedProperty)
router.get('/users',  UserController.getUsers)
router.get("/find/:id", UserController.findUser)
router.put('/change/:id', UserController.changePassword)
router.post('/edit/:id', UserController.editProfile)

module.exports = router;