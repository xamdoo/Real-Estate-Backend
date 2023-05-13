const mongoose = require("mongoose");

const propertySchema = mongoose.Schema(
  {
    //
    propertyType: {
      required: true,
      type: String,
      maxLength: 25,
      trim: true,
    },
    //
    bedrooms: {
      required: true,
      type: Number,
    },
    //
    squareFT: {
      required: true,
      type: String,
      trim: true,
    },
    //
    price: {
      required: true,
      type: Number,
    },
    //
    bathroom: {
      required: true,
      type: Number,
    },
    //
    balcony: {
      type: Number,
    },
    //
    yearBuilt: {
      required: true,
      type: Number,
    },
    //
    status: {
      required: true,
      type: String,
      trim: true,
    },
    //
    lift: {
      type: Number,
    },
    //
    location: {
      required: true,
      type: String,
      trim: true,
    },
    //
    descriptionProp: {
      type: String,
      trim: true,
    },
    //
    refrenceNo: {
      required: true,
      type: Number,
    },

    garage: {
      type: Boolean,
      default: false,
    },
    contract: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    userID: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    //AMENITIES
    FullyFurnished: {
      type: Boolean,
      default: false,
    },
    QueitSaroudings: {
      type: Boolean,
      default: false,
    },
    BathHub: {
      type: Boolean,
      default: false,
    },
    NoSmookingRooms: {
      type: Boolean,
      default: false,
    },

    FireExtinguish: {
      type: Boolean,
      default: false,
    },

    HomeSecurity: {
      type: Boolean,
      default: false,
    },

    ACRooms: {
      type: Boolean,
      default: false,
    },

    HightSpeedWifi: {
      type: Boolean,
      default: false,
    },

    Oven: {
      type: Boolean,
      default: false,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
          max: 4,
        },
        url: {
          type: String,
          required: true,
          max: 4,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const propertyModel = mongoose.model("propertyModel", propertySchema);

module.exports = propertyModel;
