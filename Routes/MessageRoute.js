const express = require('express')
const router =  express.Router()


const MessageController = require("../Controllers/MessageController")


router.post('/', MessageController.addMessage) // creates a new message
router.get('/:chatId', MessageController.getMessages) // get all messages of specific chat

module.exports = router