const mongoose = require("mongoose");

const ownerSchema = mongoose.Schema(
  {
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
      },
      image: {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
  },
  {
    timestamps: true,
  }
);

const ownerModel = mongoose.model("ownerModel", ownerSchema);

module.exports = ownerModel;
