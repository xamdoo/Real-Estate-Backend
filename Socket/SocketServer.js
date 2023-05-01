const socketIO = require('socket.io')

const io = socketIO({
    cors:{
        origin: "*",
        Credential: true
    }
});

let activeUsers = []

io.on('connection', (socket)=>{

    //listen to a connection and add a new user
    socket.on('addNewUser', (newUserId)=>{
        //if user is not added previously
        if(!activeUsers.some((user)=> user.userId === newUserId))
        {
            activeUsers.push({
                userId: newUserId,
                socketId: socket.id
            })
        } 
        
        io.emit('getOnlineUsers', activeUsers) //send online users to the client
    })


    //Send Message
    socket.on('sendMessage', (message)=>{
        
        const user = activeUsers.find((user)=> user.userId === message.recipientId);

        if(user){
            io.to(user.socketId).emit("receiveMessage", message);
            io.to(user.socketId).emit("getNotification", {
                senderId: message.senderId,
                isRead: false,
                date: new Date()
            })
        }
    })

    socket.on("disconnect", ()=>{
        activeUsers = activeUsers.filter((user)=> user.socketId !== socket.id)
        //console.log("User Disconnected", activeUsers)
        io.emit('getOnlineUsers', activeUsers)
    })
});


module.exports = io;