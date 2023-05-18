const propModel = require("../Models/propertyModel");
const cloudinary = require("../Utilis/cloudinary");

const houseList = async (req, res) => {
  //VALUES HOLDERS
  let saleHouses = [];
  let rentHouses = [];

  try {
    //GETING ALL THE DATA FROM THE DATABASE
    const houseList = await propModel.find().sort({ createdAt: -1 });
    //THEN MAPPING AND FILTERING THE VALUES THAT GOT FROM THE DATABASE
    houseList
      .map((types) => types)
      .filter((e) => {
        if (e.contract === "rent") {
          const updateRentHouses = [...rentHouses, e];

          rentHouses = updateRentHouses;
        } else if (e.contract === "sale") {
          const updateSaleHouses = [...saleHouses, e];

          saleHouses = updateSaleHouses;
        }
      });

    res.status(200).json({ rentHouses, saleHouses });
  } catch (e) {
    res.status(400).json({ ERROR: "SOMETHING WENT WRONG" });
    console.log(e);
  }
};

const findSearchedProperties = async (req, res) => {
  let { options, location, contract } = req.query;
  //
  if (!options || !location) {
    return res.status(401).json({ ERROR: " search somthing " });
  }

  //LOCATION CAPITALIZATION
  const locat = location.split(" ");
  //
  const locationCapital = locat.map((lo) => {
    return lo.trim().charAt(0).toUpperCase() + lo.slice(1);
  });
  const locationCapitalFirstLetter = locationCapital.join("");

  //OPTIONS CAPITALIZATION
  const opt = options.split(" ");
  //
  const opCapital = opt.map((op) => {
    return op.trim().charAt(0).toUpperCase() + op.slice(1);
  });
  const optCapitalFirstLetter = opCapital.join("");

  //RE-ASSIGNING THE VARIABLE
  options = optCapitalFirstLetter;
  location = locationCapitalFirstLetter;
  contract = contract ? contract : "rent";

  try {
    const searchList = await propModel.find({
      propertyType: options, //PROP TYPE
      location: location, //PROP LOCATION
      contract: contract, ///TYPE OF CONTRACT RENT OR SALE
    });
    //FIDNING ANY SIMILAR TO THAT TYPE OF RENT OR SALE FROMT THE USER
    const simirlarProperties = await propModel.find({ contract: contract }); //IF IT SALE IT SHOULD RECOMEND THE USER ALL SALE HOUSES
    // SENDING THE DATA TO THE FRONT-END
    res.status(200).json({ searchList, simirlarProperties });
  } catch (e) {
    res.status(400).json({ ERROR: "ERROR FROM GET-LIST OF SEARCH HOUSES " });
    console.log(e);
  }
};

const oneHouse = async (req, res) => {
  const houseID = req.params.id;

  try {
    const oneProp = await propModel.findById(houseID).populate("userID");
    const recomendHouses = await propModel.find({ userID: oneProp.userID });

    res
      .status(200)
      .json({ MESSAGE: " here is your house", oneProp, recomendHouses });
  } catch {
    res.status(400).json({ ERROR: "ERROR FROM GET-LIST OF HOUSE (one) " });
  }
};

//GET ALL

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
    images,
    //THESE ARE NOT REQUIRED BY DEFAULT THEY WILL BE AUTOMATICALLY FALSE AND THE FRONT-END WILL BE NO AVAILABE "THIS..."

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

  //PROPERTY TYPE CAPITALIZATION
  const strgs = propertyType.split(" ");
  //
  const capitalizedStr = strgs.map((str) => {
    return str.trim().charAt(0).toUpperCase() + str.slice(1);
  });

  const capitalizeFirstLetter = capitalizedStr.join(" ");

  //LOCATION CAPITALIZATION
  const locat = location.split(" ");
  //
  const locationCapital = locat.map((lo) => {
    return lo.trim().charAt(0).toUpperCase() + lo.slice(1);
  });

  const locationCapitalFirstLetter = locationCapital.join(" ");

  //STATUS CAPITALIZATION
  const stat = status.split(" ");
  //
  const statCapital = stat.map((st) => {
    return st.trim().charAt(0).toUpperCase() + st.slice(1);
  });

  const statusCapitalized = statCapital.join(" ");

  try {
    let images = [...req.body.images];
    let imagesBuffer = [];

    // //LOOPING TO ADD THE ABOVE VARIBALE EVERY IMAGE OF THAT PROPERTY IMAGES TO SAVE ONE TIME
    for (let i = 0; i < images.length; i++) {
      //UPLOADING THE IMAGES TO CLOUDINARY
      const result = await cloudinary.uploader.upload(images[i], {
        //FOLDER NAME WILL BE "propertyImages"
        folder: "Property__Images",
        // width: 1920,
        crop: "scale",
      });

      //PUSHING TO THE IMAGESBUFFER VARIABLE TO GET ONE SETTED IMAGE URL TO SAVE IT
      imagesBuffer.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    // req.body.images = imagesBuffer;

    const valueToCreate = {
      propertyType: capitalizeFirstLetter,
      bedrooms,
      price,
      squareFT,
      bathroom,
      yearBuilt,
      status: statusCapitalized,
      location: locationCapitalFirstLetter,
      refrenceNo,
      contract,
      images: imagesBuffer,
      //THESE ARE NOT REQUIRED BY DEFAULT THEY WILL BE AUTOMATICALLY FALSE AND THE FRONT-END WILL BE NO AVAILABE "THIS..."
      userID: req.user.id,
      HomeSecurity,
      ACRooms,
      HightSpeedWifi,
      /////
      descriptionProp,
    };

    const posted = await propModel.create(valueToCreate);
    res.status(200).json({ sucess: true, posted });
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
  findSearchedProperties,
};
