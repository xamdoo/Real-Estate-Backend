const mongoose = require("mongoose");

const schedules = mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  propertyID: {
    type: mongoose.Types.ObjectId,
    ref: "propertyModel",
  },
  clientID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  agentID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

const schedulesModel = mongoose.model("schedules", schedules);

module.exports = schedulesModel;
