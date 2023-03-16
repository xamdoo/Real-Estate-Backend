const propModel = require("../Models/propertyModel");

const houseList = async (req, res) => {
  try {
    const houseList = await propModel.find().populate("owner");
    res.status(200).json({ MESSAGE: "here is your list", houseList });
  } catch {
    res.status(400).json({ ERROR: "ERROR FROM GET-LIST OF HOUSES " });
  }
};

const oneHouse = async (req, res) => {
  const houseID = req.params.id;
  try {
    const oneHouse = await propModel.findById(houseID).populate("owner");
    res.status(200).json({ MESSAGE: "Here is your house", oneHouse });
  } catch {
    res.status(400).json({ ERROR: "ERROR FROM GET-LIST OF HOUSE (one) " });
  }
};

const postHouse = async (req, res) => {
  if (
    !req.body.propertylocation ||
    !req.body.propertyType ||
    !req.body.priceFrom ||
    !req.body.priceTo ||
    !req.body.squareFt ||
    !req.body.discription ||
    !req.body.feature ||
    !req.body.image
  ) {
    return res.status(400).json({ ERROR: "please fill the form" });
  }

  try {
    await propModel.create(req.body);
    res.status(200).json({ MESSAGE: "submited your form " });
  } catch (e) {
    res.status(400).json({ ERROR: "ERROR FROM CREATE HOUSE ", e });
    console.log(e);
  }
};

const updateHouse = async (req, res) => {
  const houseID = req.params.id;

  const houseList = await propModel.findById(houseID);

  const valueToUpdate = {
    propertylocation: req.body.propertylocation || propModel.propertylocation,
    propertyType: req.body.propertyType || propModel.propertyType,
    priceFrom: req.body.priceFrom || propModel.priceFrom,
    priceTo: req.body.priceTo || propModel.priceTo,
    squareFt: req.body.squareFt || propModel.squareFt,
    discription: req.body.discription || propModel.discription,
    feature: {
      balcony: req.body.feature.balcony || houseList.feature.balcony,
      yearBuilt: req.body.feature.yearBuilt || houseList.feature[0].yearBuilt,
      status: req.body.feature.status || houseList.feature[0].status,
      contract: req.body.feature.contract || houseList.feature[0].contract,
      type: req.body.feature.type || houseList.feature[0].type,
      homeArea: req.body.feature.homeArea || houseList.feature[0].homeArea,
      rooms: req.body.feature.rooms || houseList.feature[0].rooms,
      bedrooms: req.body.feature.bedrooms || houseList.feature[0].bedrooms,
      baths: req.body.feature.baths || houseList.feature[0].baths,
      garages: req.body.feature.garages || houseList.feature[0].garages,
      material: req.body.feature.material || houseList.feature[0].material,
      sold: req.body.feature.sold || houseList.feature[0].sold,
      reference: req.body.feature.reference || houseList.feature[0].reference,
      contactName:
        req.body.feature.contactName || houseList.feature[0].contactName,
      price: req.body.feature.price || houseList.feature[0].price,
    },
    image: req.body.image || propModel.image,
  };
  try {
    await propModel.findByIdAndUpdate(houseID, valueToUpdate);
    res.status(200).json({ MESSAGE: "successfully updated!!" });
  } catch (e) {
    res.status(400).json({ ERROR: "error from updating House", e });
  }
};

const deleteHouse = async (req, res) => {
  try {
    const houseID = req.params.id;
    await propModel.findByIdAndDelete(houseID);
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
};
