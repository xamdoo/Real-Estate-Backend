const mongoose = require("mongoose");

const recommendModel = mongoose.Schema(
  {
    ownerID: {
      type: mongoose.Types.ObjectId,
      ref: "owner",
    },

    propertyID: {
      type: mongoose.Types.ObjectId,
      ref: "propertyModel",
    },
  },
  {
    timeStamps: true,
  }
);

const recoModel = mongoose.model("recoModel", recommendModel);

module.exports = recoModel;
