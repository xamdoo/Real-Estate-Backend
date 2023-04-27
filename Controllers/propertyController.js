const propModel = require("../Models/propertyModel");
const cloudinary = require("../Utilis/cloudinary");
// const multiPart = require("connect-multiparty");
// const multiPartMiddleWare = multiPart();

const houseList = async (req, res) => {
  try {
    const houseList = await propModel.find();

    res.status(200).json({ MESSAGE: "here is your list", houseList });
  } catch {
    res.status(400).json({ ERROR: "ERROR FROM GET-LIST OF HOUSES " });
  }
};

const rentHouses = async (req, res) => {
  try {
    const houseList = await propModel.find().sort({ createdAt: -1 });
    const rentHouses = houseList.filter((found, index) => {
      if (found.contract == "rent") {
        return found;
      }
    });

    res.status(200).json({ MESSAGE: "the rent houses", rentHouses });
  } catch {
    res.status(400).json({ ERROR: "from rent " });
  }
};

const saleHouses = async (req, res) => {
  try {
    const houseList = await propModel.find().sort({ createdAt: -1 });
    const saleHouses = houseList.filter((found, index) => {
      if (found.contract == "sale") {
        return found;
      }
    });

    res.status(200).json({ MESSAGE: "the sale houses", saleHouses });
  } catch {
    res.status(400).json({ ERROR: "from sale " });
  }
};

const oneHouse = async (req, res) => {
  const houseID = req.params.id;

  try {
    const oneProp = await propModel.findById(houseID).populate("ownerID");
    console.log(oneProp);
    res.status(200).json({ MESSAGE: " here is your house", oneProp });
  } catch {
    res.status(400).json({ ERROR: "ERROR FROM GET-LIST OF HOUSE (one) " });
  }
};

const postHouse = async (req, res) => {
  const {
    propertyType,
    bedrooms,
    price,
    squareFT,
    bathroom,
    yearBuilt,
    status,
    location,
    refrenceNo,
    contract,
    image,
    //THESE ARE NOT REQUIRED BY DEFAULT THEY WILL BE AUTOMATICALLY FALSE AND THE FRONT-END WILL BE NO AVAILABE "THIS..."
    ownerID,
    HomeSecurity,
    ACRooms,
    HightSpeedWifi,
    /////
    descriptionProp,
  } = req.body;

  if (
    !propertyType ||
    !bedrooms ||
    !price ||
    !squareFT ||
    !bathroom ||
    !yearBuilt ||
    !status ||
    !location ||
    !refrenceNo ||
    !contract
  ) {
    return res.status(400).json({ ERROR: "please fill the required fields" });
  }

  if (propertyType.length > 25) {
    return res
      .status(400)
      .json({ ERROR: "maximum  character's allowed  is 10 " });
  }

  try {
    //UPLOADING THE IMAGE TO CLOUDINARY
    const result = await cloudinary.uploader.upload(image, {
      //FOLDER NAME WILL BE "propertyImages"
      folder: "propertyImages",
    });

    await propModel.create({
      propertyType,
      bedrooms,
      price,
      squareFT,
      bathroom,
      yearBuilt,
      status,
      location,
      refrenceNo,
      contract,
      image: {
        public_id: result.public_id,
        url: result.url,
      },
      //THESE ARE NOT REQUIRED BY DEFAULT THEY WILL BE AUTOMATICALLY FALSE AND THE FRONT-END WILL BE NO AVAILABE "THIS..." FOR NOW IT'S SOME OF IT
      ownerID,
      HomeSecurity,
      ACRooms,
      HightSpeedWifi,
      descriptionProp,
    });
    res.status(200).json({ MESSAGE: "created your property " });
  } catch (e) {
    res.status(400).json({ ERROR: "ERROR FROM CREATE HOUSE " });
    console.log(e);
  }
};

const updateHouse = async (req, res) => {
  const houseID = req.params.id;

  const prevModel = await propModel.findById(houseID);
  //checking if the id is exists
  if (!prevModel) {
    return res.status(400).json({ ERROR: "property not found !!!" });
  }

  const valueToUpdate = {
    propertyType: req.body.propertyType || prevModel.propertyType,
    bedroom: req.body.bedroom || prevModel.bedroom,
    squareFT: req.body.squareFT || prevModel.squareFT,
    price: req.body.price || prevModel.price,
    bathroom: req.body.bathroom || prevModel.bathroom,
    balcony: req.body.balcony || prevModel.balcony,
    yearBuilt: req.body.yearBuilt || prevModel.yearBuilt,
    status: req.body.status || prevModel.status,
    lift: req.body.lift || prevModel.lift,
    location: req.body.location || prevModel.location,
    refrenceNo: req.body.refrenceNo || prevModel.refrenceNo,
    garage: req.body.garage || prevModel.garage,
    contract: req.body.contract || prevModel.contract,
  };

  try {
    await propModel.findByIdAndUpdate(houseID, valueToUpdate);

    res.status(200).json({ MESSAGE: "successfully updated!!" });
  } catch (e) {
    res.status(400).json({ ERROR: "error from updating House", e });
  }
};

const deleteHouse = async (req, res) => {
  const houseID = req.params.id;
  try {
    const founded = await propModel.findByIdAndDelete(houseID);
    //checking if the id is exists
    if (!founded) {
      return res.status(400).json({ MESSAGE: "property not found !!" });
    }
    res.status(200).json({ MESSAGE: "successfully deleted!!" });
  } catch {
    res.status(400).json({ ERROR: "error from deleting House" });
  }
};

module.exports = {
  houseList,
  oneHouse,
  postHouse,
  updateHouse,
  deleteHouse,
  rentHouses,
  saleHouses,
};
