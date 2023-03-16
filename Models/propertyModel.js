const mongoose = require("mongoose");

const propertySchema = mongoose.Schema(
  {
    propertyType: {
      type: String,
    },

    propertylocation: {
      type: String,
    },
    priceFrom: {
      type: Number,
    },
    priceTo: {
      type: Number,
    },

    squareFt: {
      type: Number,
    },

    discription: {
      type: String,
    },

    feature: [
      {
        balcony: {
          type: Number,
        },
        yearBuilt: {
          type: Number,
        },
        status: {
          type: String,
        },
        contract: {
          type: String,
        },
        type: {
          type: String,
        },
        homeArea: {
          type: Number,
        },
        rooms: {
          type: Number,
        },
        bedrooms: {
          type: Number,
        },
        baths: {
          type: Number,
        },
        garages: {
          type: Number,
        },
        beds: {
          type: Number,
        },
        material: {
          type: String,
        },
        sold: {
          type: String,
        },
        reference: {
          type: Number,
        },
        contactName: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    image: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "owner",
    },
  },
  {
    timestamps: true,
  }
);

const propertyModel = mongoose.model("propertyModel", propertySchema);

module.exports = propertyModel;
