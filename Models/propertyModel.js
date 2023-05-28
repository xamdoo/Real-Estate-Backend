const mongoose = require("mongoose");

const propertySchema = mongoose.Schema(
  {
    userID: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
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
      type: Number,
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
      type: Boolean,
      default: false,
    },
    //
    yearBuilt: {
      required: true,
      type: Number,
    },

    //

    country: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },
    //
    descriptionProp: {
      type: String,
      trim: true,
      default: "waa guri kiro ah oo banaan",
    },
    //
    propertyNo: {
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
      default: "rent",
    },

    zipCode: {
      type: Number,
    },

    //AMENITIES
    fullyFurnished: {
      type: Boolean,
      default: false,
    },
    quiteSaroundings: {
      type: Boolean,
      default: false,
    },
    bathHub: {
      type: Boolean,
      default: false,
    },
    noSmookingRooms: {
      type: Boolean,
      default: false,
    },

    fireExtinguish: {
      type: Boolean,
      default: false,
    },

    homeSecurity: {
      type: Boolean,
      default: false,
    },

    ACRooms: {
      type: Boolean,
      default: false,
    },

    countractTime: {
      type: Number,
      default: 1,
    },
    discount: {
      type: Number,
      default: 0,
    },
    highSpeedWifi: {
      type: Boolean,
      default: false,
    },

    oven: {
      type: Boolean,
      default: false,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
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
