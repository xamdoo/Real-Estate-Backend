const mongoose = require("mongoose");

const ownerSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  schedule: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const ownerModel = mongoose.model("ownerModel", ownerSchema);

module.exports = ownerModel;
