const recoModel = require("../Models/recommendModel");

const getReco = async (req, res) => {
  try {
    const data = await recoModel
      .find()
      .populate("ownerID")
      .populate("propertyID");
    res.status(200).json({ MESSAGE: "look these as well", data });
  } catch {
    res.status(400).json({ ERROR: "error from list recommendation" });
  }
};

const getOneReco = (req, res) => {
  res.status(200).json({ MESSAGE: "I'm from get one reco" });
};

const createReco = async (req, res) => {
  if (!req.body.ownerID || !req.body.propertyID) {
    return res.status(400).json({ ERROR: "please fill the form" });
  }
  try {
    await recoModel.create(req.body);
    res.status(200).json({ MESSAGE: "CREATED YOUR RECO" });
  } catch {
    res.status(400).json({ ERROR: "error" });
  }
};

module.exports = {
  getReco,
  getOneReco,
  createReco,
};
