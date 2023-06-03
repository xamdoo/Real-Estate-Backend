const schedulesModel = require("../Models/Schedules");
const ScheduleModel = require("../Models/Schedules");
const userModel = require("../Models/UserModel");
const propModel = require("../Models/propertyModel");

const scheduleList = async (req, res) => {
  try {
    const schedulePlan = await ScheduleModel.find()
      .populate("propertyID")
      .populate("clientID")
      .populate("agentID");
    res.status(200).json({ Message: "HERE IS YOUR LIST", schedulePlan });
  } catch {
    res.status(400).json({ ERROR: "error from get schedule List " });
  }
};

const makeSchedule = async (req, res) => {
  // const userData = await userModel.findById(req.user.id);
  const propertyData = await propModel.findById(req.body.propertyId);

  const valueToSave = {
    date: req.body.date,
    propertyID: req.body.propertyId,
    clientID: req.user.id,
    agentID: propertyData.userID,
  };

  try {
    const scheduleMade = await ScheduleModel.create(valueToSave);

    res.status(200).json({ Message: "you've Scheduled", scheduleMade });
  } catch (e) {
    res.status(400).json({ ERROR: "error from  create schedule", e });
    console.log(e);
  }
};

const oneSchedule = async (req, res) => {
  const agentID = req.params.id;

  try {
    const schedulePlan = await ScheduleModel.findOne({ agentID: agentID })
      .populate("agentID")
      .populate("clientID")
      .populate("propertyID");
    console.log(schedulePlan);
    res.status(200).json({ Message: "HERE is your schedule", schedulePlan });
  } catch {
    res.status(400).json({ ERROR: "error from one schedule " });
  }
};

module.exports = {
  scheduleList,
  makeSchedule,
  oneSchedule,
};
