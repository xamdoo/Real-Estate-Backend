const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Error } = require("mongoose");
const validator = require("validator");
const cloudinary = require("../Utilis/cloudinary");

//Function to create JWT token
const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET;

  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};
//@desc Register new User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, is_agent } = req.body;

    //Capitalize the first letter
    const str = name.split(" ");
    const capitalizedStr = str.map((str) => {
      return str.trim().charAt(0).toUpperCase() + str.slice(1);
    });

    const capitalizeFirstLetter = capitalizedStr.join(" ");

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
      name: capitalizeFirstLetter,
      email,
      phone: req.body.phone,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      is_agent,
    });
    res.status(200).json({ message: "You've created an account" });
  } catch (e) {
    res.status(500).json({ message: "There was an error!" });
    console.log(e);
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

    const token = createToken(findUser._id);
    res.status(200).json({
      _id: findUser._id,
      name: findUser.name,
      email,
      phone: findUser.phone,
      agent: findUser.is_agent,
      address: findUser.address,
      image: findUser.image,
      token,
    });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(e);
  }
};

//@desc Edit User Profile
const editProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const { name, address, phone } = req.body;

    // Capitalize the first letter of each word in name and address
    const capitalizeFirstLetter = (str) => {
      if (!str || str.trim().length === 0) {
        return str; // return the empty string or undefined value
      }
      const words = str.trim().split(" ");
      return words
        .map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    };

    user.name = capitalizeFirstLetter(name);
    user.address = capitalizeFirstLetter(address);
    user.phone = phone;

    if (req.body.image) {
      const result = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${req.body.image}`,
        {
          folder: "userProfile",
        }
      );
      user.image = {
        public_id: result.public_id,
        url: result.url,
      };
    }

    await user.save();

    const {
      password,
      confirmPassword,
      savedProperties,
      viewedProperties,
      is_agent,
      ...userData
    } = user._doc;

    return res
      .status(200)
      .json({ message: "Profile updated successfully", userData });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const { id } = req.params;
    const user = await User.findById(id);

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(401).json({ message: "the Password don't match" });
    }

    if (oldPassword === newPassword) {
      return res.status(401).json({ message: "Please enter a new Password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    req.body.password = hashedPassword;
    req.body.confirmPassword = hashedPassword;
    await User.findByIdAndUpdate(user, req.body, { new: true });
    res.status(200).json({ message: "Password successfully changed" });
  } catch (e) {
    res.status(401).json({ message: "Error! please try again." });
  }
};

//@desc retrieving user's Saved Properties
const savedProperties = async (req, res) => {
  try {
    const { userId, propertyId } = req.body;

    if (!userId || !propertyId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const viewedAt = Date.now();
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //Check if the Property Id is present and it doesn't already exist
    const savedProperty = user.savedProperties.find(
      (savedProp) => savedProp.propertyId.toString() === propertyId
    );

    if (savedProperty) {
      return res.status(400).json({ message: "Already saved" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        //add the savedProperty to the array unless the value is already present
        $addToSet: {
          savedProperties: {
            propertyId,
            viewedAt,
          },
        },
      },
      { new: true }
    )
      .populate({
        path: "savedProperties.propertyId",
      })
      .exec();

    if (
      !updatedUser.savedProperties ||
      updatedUser.savedProperties.length === 0
    ) {
      res.status(400).json({ message: "No Saved properties found" });
    }

    res.status(200).json({ savedProperties: updatedUser.savedProperties });
  } catch {
    return res
      .status(500)
      .json({ message: "Error retrieving saved properties" });
  }
};

//@desc Update user's Viewed Properties
const viewedProperties = async (req, res) => {
  try {
    const { userId, propertyId } = req.body;

    if (!userId || !propertyId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const viewedAt = Date.now();
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //Check if the Property Id is present and it doesn't already exist
    const viewedProperty = user.viewedProperties.find(
      (viewedProp) => viewedProp.propertyId.toString() === propertyId
    );

    if (viewedProperty) {
      return res.status(400).json({ message: "Property already viewed" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        //add the viewedProperty to the array unless the value is already present
        $addToSet: {
          viewedProperties: {
            propertyId,
            viewedAt,
          },
        },
      },
      { new: true }
    )
      .populate({
        path: "viewedProperties.propertyId",
      })
      .exec();

    if (
      !updatedUser.viewedProperties ||
      updatedUser.viewedProperties.length === 0
    ) {
      res.status(400).json({ message: "No viewed properties found" });
    }

    res.status(200).json({ viewedProperties: updatedUser.viewedProperties });
  } catch (e) {
    console.log(e.message);
    return res
      .status(500)
      .json({ message: "Error updating viewed properties" });
  }
};

//@desc Clear User's Viewed Properties
const clearViewedProperties = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.viewedProperties = []; // Clear the viewed properties array
    const updatedUser = await user.save();

    res
      .status(200)
      .json({ message: "Successfully cleared searches", user: updatedUser });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Error clearing viewed properties" });
  }
};

//@desc Clear User's Saved Properties
const clearSavedProperties = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Clear the saved properties array
    user.savedProperties = [];
    const updatedUser = await user.save();

    res
      .status(200)
      .json({ message: "Successfully cleared favorites", user: updatedUser });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Error clearing favorite properties" });
  }
};

//@desc Protect Middleware to Authenticate user
const protect = async (req, res, next) => {
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
        id: decoded._id,
      };

      next();
    });
  } catch {
    res.status(500).json({ Message: "Server Error" });
  }
};

//@desc Retrieve all users in the database
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (e) {
    return res.status(400).json({ message: "User not found" });
  }
};

//@desc Retrieve the details of a specific user
const findUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      const { password, confirmPassword, ...otherDetails } = user._doc;

      res.status(200).json(otherDetails);
    }
  } catch (e) {
    return res.status(400).json({ message: "User not found" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  savedProperties,
  viewedProperties,
  protect,
  getUsers,
  findUser,
  clearViewedProperties,
  clearSavedProperties,
  changePassword,
  editProfile,
};
