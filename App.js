const express = require("express");
const cors = require("cors");

const dotenv = require("dotenv");
const port = process.env.PORT || 3000;
const io = require("./Socket/SocketServer");
const http = require("http");
const { errorHandler } = require("./Middlewares/errorMiddleware");
const app = express();
app.use(cors());
app.use(express.json({ limit: "3000mb", extended: true }));
app.use(express.urlencoded({ extended: true }));
//USING CORS TO GET ACCESS TO ANY INCOMING  HOST

///ROUTES
const UserRoute = require("./Routes/UserRoute");
const ChatRoute = require("./Routes/ChatRoute");
const MessageRoute = require("./Routes/MessageRoute");
const propertyRoute = require("./Routes/propertyRoute");
const scheduleRoute = require("./Routes/schedulesRoute");

//INITIALIZING THE DONTENV FILE
dotenv.config({ path: "./.env" });
//requiring the DB
require("./server");

//USING IO OR SOCKET IO
app.use((req, res, next) => {
  req.io = io;
  next();
});

const server = http.createServer(app);
io.attach(server);

//USING ERROR HANDLER TO KNOW WHERE SOMETHING GOT WRONG
app.use(errorHandler);

//THE ROUTES AND ENDPOINTS
app.use("/auth", UserRoute);
app.use("/chat", ChatRoute);
app.use("/message", MessageRoute);
app.use("/propertyInfo", propertyRoute); //ME
app.use("/schedule", scheduleRoute); // ME

//LISTENING THE SERVER
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
