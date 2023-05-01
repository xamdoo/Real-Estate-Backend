const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
var bodyParser = require("body-parser");

const UserRoute = require("./Routes/UserRoute");
const ChatRoute = require("./Routes/ChatRoute");
const MessageRoute = require("./Routes/MessageRoute");
const propertyRoute = require("./Routes/propertyRoute");
const recoRoute = require("./Routes/recoRoute");
const ownerRoute = require("./Routes/ownerRoute");

const app = express();

app.use(express.json({ limit: "1000mb", extended: true }));

dotenv.config({ path: "./.env" });
require("./server");

app.use(cors());

app.use("/users", UserRoute);

app.use("/chat", ChatRoute);
app.use("/message", MessageRoute);
app.use("/propertyInfo", propertyRoute); //ME
app.use("/recommendation", recoRoute); // ME
app.use("/owner", ownerRoute); // ME

app.listen(3002, () => {
  console.log("Listening on port 3002");
});
