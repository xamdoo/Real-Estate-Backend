const Chat = require("../Models/ChatModel");


//@desc Creating a new chat from getting instance from chatModel
const createChat = async(req, res)=>{
    const {senderId, receiverId} = req.body

    try {
        //check if a chat already exists 
        const chat = await Chat.findOne({
            members: {$all: [senderId, receiverId]}
        });

        if(chat) return res.status(200).json(chat)

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


//@desc Find all chats that involve the user with the ID specified
const userChats = async(req, res)=>{
    const userId = req.params.userId
    try{
        const chat = await Chat.find({
            members: {$in:[userId]} // The $in operator selects the documents where the value of a field equals any value in the specified array.
        })
        
        res.status(200).json(chat)
    }catch(error){
        res.status(500).json({ Message: "No chats"})
    }
}

//@desc Find a chat between two members, identified by their firstId and secondId parameters.
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
