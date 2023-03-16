const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const ChatRoute = require("./Routes/ChatRoute");
const MessageRoute = require("./Routes/MessageRoute");
//
const contactRoute = require("./Routes/contactRoute");
const propertyRoute = require("./Routes/propertyRoute");

const app = express();
app.use(express.json());

dotenv.config({ path: "./.env" });
require("./server");

app.use(cors());

app.use("/chat", ChatRoute);
app.use("/message", MessageRoute);
//
app.use("/info", contactRoute);
app.use("/propertyInfo", propertyRoute);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
