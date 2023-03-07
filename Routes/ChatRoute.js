const express = require('express')
const router = express.Router()

const ChatController = require("../Controllers/ChatController")

router.post("/", ChatController.createChat) //creating a new chat
router.get("/:userId", ChatController.userChats) //finding all chats of a specific user
router.get("/find/:firstId/:secondId", ChatController.findChat) //finding specific chat with specific person



module.exports = router