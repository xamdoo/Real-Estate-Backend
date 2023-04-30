const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const port = process.env.PORT || 3000
const io = require('./Socket/SocketServer');
const http = require('http')
const { errorHandler } = require('./Middlewares/errorMiddleware')

const UserRoute = require('./Routes/UserRoute')
var bodyParser = require("body-parser");

const UserRoute = require("./Routes/UserRoute");
const ChatRoute = require("./Routes/ChatRoute");
const MessageRoute = require("./Routes/MessageRoute");
const contactRoute = require("./Routes/contactRoute");
const propertyRoute = require("./Routes/propertyRoute");
const recoRoute = require("./Routes/recoRoute");
const ownerRoute = require("./Routes/ownerRoute");

const app = express();

app.use(express.json({ limit: "1000mb", extended: true }));

dotenv.config({ path: "./.env" });
require("./server");

app.use(cors());

app.use((req, res, next) => {
    req.io = io;
    next();
});

const server = http.createServer(app)
io.attach(server)


app.use(errorHandler)

app.use("/auth", UserRoute)
app.use("/users", UserRoute);

app.use("/chat", ChatRoute);
app.use("/message", MessageRoute);
app.use("/info", contactRoute);
app.use("/propertyInfo", propertyRoute);
app.use("/recommendation", recoRoute);
app.use("/owner", ownerRoute);




server.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})

