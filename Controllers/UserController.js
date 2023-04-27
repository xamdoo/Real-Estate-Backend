const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

//@desc Register new User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, confirmPassword } = req.body;

    //validate input data
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please add all fields" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    //check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    //encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create user
    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      confirmPassword: hashedPassword,
    });

    res.status(200).json({ message: "You've created an account" });
  } catch (e) {
    res.status(500).json({ message: "There was an error!" });
  }
};

//@desc Authenticate User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    //check user email and password
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(400).json({ message: "Email/Password is incorrect" });
    }

    const isPasswordMatch = await bcrypt.compare(password, findUser.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Email/Password is incorrect" });
    }

    //generate token
    const token = jwt.sign(
      {
        id: findUser._id,
        email: findUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );
    res.status(200).json({ message: "You have logged in", token });
  } catch {
    res.status(500).json({ message: "Something went wrong" });
  }
};

//@desc retrieving user's Saved Properties
// Will add authentication so that only the user can retrieve the data
const savedProperties = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    //.populate('savedProperties.propertyId')
    if (!user) {
      res.status(400).json({ message: "User not found" });
    }
    const savedProperties = user.savedProperties;
    if (!savedProperties || savedProperties.length === 0) {
      res.status(400).json({ message: "No saved properties found" });
    }
    res.status(200).json({ savedProperties });
  } catch {
    return res
      .status(500)
      .json({ message: "Error retrieving saved properties" });
  }
};

//@desc retrieving user's Viewed Properties
const viewedProperties = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(400).json({ message: "User not found" });
    }
    const viewedProperties = user.viewedProperties;
    if (!viewedProperties || viewedProperties.length === 0) {
      res.status(400).json({ message: "No viewed properties found" });
    }
    res.status(200).json({ viewedProperties });
  } catch {
    return res
      .status(500)
      .json({ message: "Error retrieving viewed properties" });
  }
};

//@desc Protect Middleware to Authenticate user
const Protect = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "You're not logged in!" });
    }

    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        return res.status(401).json({ message: "Your session has expired" });
      }

      req.user = {
        id: decoded.id,
        email: decoded.email,
      };
    });
    next();
  } catch {
    res.status(500).json({ Message: "Server Error" });
  }
};

//@desc Retrieve User-specific object
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ user });
  } catch (e) {
    return res.status(400).json({ message: "User not found" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  savedProperties,
  viewedProperties,
  Protect,
  getUser,
};
