const express = require("express");
const router = express.Router();


const ChatController = require("../Controllers/ChatController")
const UserController = require("../Controllers/UserController")

router.post("/", ChatController.createChat) //creating a new chat
router.get("/:userId", UserController.Protect, ChatController.userChats) //finding all chats of a specific user
router.get("/find/:firstId/:secondId", UserController.Protect, ChatController.findChat) //finding specific chat with specific person

module.exports = router;
