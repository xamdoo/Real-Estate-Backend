const Chat = require("../Models/ChatModel")


//@desc Creating a new chat from getting instance from chatModel
const createChat = async(req, res)=>{
    const newChat = new Chat({
        members: [req.body.senderId, req.body.receiverId]
    });

    try{
        const result = await newChat.save()
        res.status(200).json(result)
    }catch(error){
        res.status(500).json(error)
    }
}

//@desc Find all chats that involve the user with the ID specified
const userChats = async(req, res)=>{
    
    try{
        const chat = await Chat.find({
            members: {$in:[req.params.userId]} // The $in operator selects the documents where the value of a field equals any value in the specified array.
        })
        
        res.status(200).json(chat)
    }catch(error){
        res.status(500).json(error)
    }
}

//@desc Find a chat between two members, identified by their firstId and secondId parameters.
const findChat = async(req, res)=>{
    try{
        const chat = await Chat.findOne({
            members: {$all: [req.params.firstId, req.params.secondId]} //The $all operator specifies the chat to contain both firstId and secondId in its members array.
        })
        res.status(200).json(chat)
    }catch(error){
        res.status(500).json(error)
    }
}

module.exports = {
    createChat,
    userChats,
    findChat
}