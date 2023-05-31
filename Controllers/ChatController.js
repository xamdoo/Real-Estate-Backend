const Chat = require("../Models/ChatModel");
const Message = require("../Models/MessageModel")

//@desc Creating a new chat from getting instance from chatModel
const createChat = async(req, res)=>{
    const {senderId, receiverId} = req.body

    if (!senderId || !receiverId) {
        return res.status(400).json({ message: "Sender ID and receiver ID are required." });
    }

    try {
        //check if a chat already exists 
        const existingChat = await Chat.findOne({
            members: {$all: [senderId, receiverId]}
        });


        if (existingChat) {
            return res.status(200).json(existingChat)
        }

        //If members array is empty, do not save the data
        if (senderId === receiverId) {
            return res.status(400).json({ error: "Sender ID and receiver ID cannot be the same." });
        }

        //if chat doesn't exist, create one
        const newChat = new Chat({
            members: [senderId, receiverId]
        });

        const response = await newChat.save()
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json(error);
    }
};

//@desc Retrieve all chats for a specific user 
const userChats = async(req, res)=>{
    const userId = req.params.userId
    try{
        const chat = await Chat.find({
            members: {$in:[userId]} // The $in operator selects the documents where the value of a field equals any value in the specified array.
        }).populate('messages', 'text createdAt');
        
        res.status(200).json(chat)
    }catch(error){
        res.status(500).json({ Message: "No chats"})
    }
}

//@desc Retrieve a chat between two members, identified by their firstId and secondId parameters.
const findChat = async(req, res)=>{
    const {firstId, secondId} = req.params
    try{
        const chat = await Chat.findOne({
            members: {$all: [firstId, secondId]} //The $all operator specifies the chat to contain both firstId and secondId in its members array.
        })
        res.status(200).json(chat)
    }catch(error){
        res.status(500).json(error)
    }
}


module.exports = {
    createChat,
    userChats,
    findChat,
};
