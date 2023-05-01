const ownerModel = require("../Models/contactModel");
const bcrypt = require("bcrypt");
const validator = require("validator");

const getOwners = async (req, res) => {
  try {
    const ownerList = await ownerModel.find();
    res
      .status(200)
      .json({ message: "here is your ownerLists", data: ownerList });
  } catch {
    res.status(400).json({ error: "error from getOwner'sList" });
  }
};

const getOneOwner = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const data = await ownerModel.findById(ownerId);
    res.status(200).json({ message: "here is your specific owner", data });
  } catch {
    res.status(400).json({ error: "error from oneOwnerlist" });
  }
};

const postOwner = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password, schedule, image } =
      req.body;

    if (!firstName || !lastName || !phone || !email || !password || !schedule) {
      return res.status(401).json({ ERROR: "fill the form first" });
    }

    const findOwner = await ownerModel.findOne({ email });

    if (findOwner) {
      return res.status(401).json({ ERROR: "this email is already taken" });
    }

    if (!validator.isEmail(email)) {
      return res.status(401).json({ ERROR: "invalid email address" });
    }

    if (password.length < 6) {
      return res.status(401).json({ ERROR: "password must be 6 character " });
    }
    const encryptedPassword = await bcrypt.hash(password, 10);

    const ownerForm = {
      firstName,
      lastName,
      phone,
      email,
      password: encryptedPassword,
      schedule,
      image,
    };

    const ownerInfo = await ownerModel.create(ownerForm);
    res.status(201).json({ message: "You've created successfully" });
  } catch (e) {
    res.status(500).json({ error: "OOPS something wrong", e });
  }
};

const editOwner = async (req, res) => {
  try {
    const ownerId = req.params.id;
    //
    const ownerData = await ownerModel.findById(ownerId);
    //
    const updatedOwner = {
      firstName: req.body.firstName || ownerData.firstName,
      lastName: req.body.lastName || ownerData.lastName,
      phone: req.body.phone || ownerData.phone,
      email: req.body.email || ownerData.email,
      password: req.body.password || ownerData.password,
      schedule: req.body.schedule || ownerData.schedule,
      image: req.body.image || ownerData.image,
    };

    await ownerModel.findByIdAndUpdate(ownerId, updatedOwner);
    //
    res.status(200).json({ message: "successfully updated" });
  } catch {
    res.status(400).json({ error: "something wrong editOwner " });
  }
};

const deleteOwner = async (req, res) => {
  try {
    const visaId = req.params.id;
    await ownerModel.findByIdAndDelete(visaId);
    res.status(200).json({ message: "successfully deleted" });
  } catch {
    res.status(400).json({ error: "something wrong from deleteOwner " });
  }
};

module.exports = {
  getOwners,
  getOneOwner,
  postOwner,
  editOwner,
  deleteOwner,
};
