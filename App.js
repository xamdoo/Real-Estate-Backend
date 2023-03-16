const express = require('express')
const dotenv = require("dotenv")
const cors = require('cors')


const UserRoute = require('./Routes/UserRoute')
const ChatRoute = require('./Routes/ChatRoute')
const MessageRoute = require('./Routes/MessageRoute')


const app = express()
app.use(express.json())


dotenv.config({path:"./.env"})
require("./server")

app.use(cors())

app.use("/users", UserRoute)
app.use("/chat", ChatRoute)
app.use("/message", MessageRoute)





app.listen(3000, ()=>{
    console.log("Listening on port 3000")
})