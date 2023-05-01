const ownerModel = require("../Models/OwnerModel");
const cloudinary = require("../Utilis/cloudinary");

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

  if ((!firstName, !lastName, !phone, !email, !password, !image)) {
    return res.status(400).json({ ERROR: "fill the required fields " });
  }

  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: "ownerImages",
      // width: 400,
      crop: "scale",
    });

    saveOwner = {
      firstName,
      lastName,
      phone,
      email,
      password,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    };

    const ownerPosted = await ownerModel.create(saveOwner);
    res.status(200).json({ MESSAGE: "registred !!!", ownerPosted });
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
