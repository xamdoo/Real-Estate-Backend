const ownerModel = require("../Models/OwnerModel");

const ownerList = async (req, res) => {
  try {
    res.status(200).json({ MESSAGE: "HELLO" });
  } catch {
    res.status(400).json({ ERROR: "from ownerList " });
  }
};

const oneOwner = async (req, res) => {
  const ownerId = req.params.id;
  try {
    res.status(200).json({ MESSAGE: "HELLO" });
  } catch {
    res.status(400).json({ ERROR: "from one Owner " });
  }
};

const postOwner = async (req, res) => {
  const { firstName, lastName, phone, email, password, schedule, image } =
    req.body;

  if ((!firstName, !lastName, !phone, !email, !password, !schedule, !image)) {
    return res.status(400).json({ ERROR: "fill the required fields " });
  }
  try {
    await ownerModel.create(req.body);
    res.status(200).json({ MESSAGE: "registred !!!" });
  } catch {
    res.status(400).json({ ERROR: "from create Owner " });
  }
};

const editOwner = async (req, res) => {
  const ownerID = req.params.id;

  const ownerInfo = await ownerModel.findById(ownerID);

  const ownerObj = {
    firstName: req.body.firstName || ownerInfo.firstName,
    firstName: req.body.lastName || ownerInfo.lastName,
    phone: req.body.phone || ownerInfo.phone,
    email: req.body.email || ownerInfo.email,
    password: req.body.password || ownerInfo.password,
    schedule: req.body.schedule || ownerInfo.schedule,
    image: req.body.image || ownerInfo.image,
  };

  try {
    await ownerModel.findByIdAndUpdate(ownerInfo, ownerObj);
    res.status(200).json({ MESSAGE: "succesfully updated !!!" });
  } catch {
    res.status(400).json({ ERROR: "from edit Owner " });
  }
};

const deleteOwner = async (req, res) => {
  const ownerId = req.params.id;

  try {
    await ownerModel.delete(ownerId);
    res.status(200).json({ MESSAGE: "sucessfuly deleted !!!" });
  } catch {
    res.status(400).json({ ERROR: "from delete Owner " });
  }
};

module.exports = {
  ownerList,
  postOwner,
  editOwner,
  oneOwner,
  deleteOwner,
};
