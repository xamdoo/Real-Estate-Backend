const express = require("express");
const router = express.Router();

const UserController = require("../Controllers/UserController");

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/savedProperties/:id", UserController.savedProperties);
router.get("/viewedProperties/:id", UserController.viewedProperties);
router.get("/:id", UserController.Protect, UserController.getUser);

router.post('/register', UserController.registerUser)
router.post('/login', UserController.loginUser)
router.post('/savedProperties', UserController.savedProperties)
router.post('/viewedProperties', UserController.viewedProperties)
router.delete('/viewedProperties', UserController.deleteViewedProperty)
router.get('/users',  UserController.getUsers)
router.get("/find/:id", UserController.findUser)
router.post('/change/:id', UserController.changePassword)
router.post('/edit/:id', UserController.editProfile)

