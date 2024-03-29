const Message = require("../Models/MessageModel");

//@desc Adding a new message to an existing chat.
const addMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new Message({
    chatId,
    senderId,
    text,
  });

  try {
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

//@desc Find all the messages in the database that match the chatId
const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const result = await Message.find({ chatId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
    addMessage,
    getMessages,
};
