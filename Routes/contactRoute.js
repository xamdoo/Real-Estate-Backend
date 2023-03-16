const express = require("express");

const router = express.Router();

const contactController = require("../Controllers/contactController");

router.route("/ownerList").get(contactController.getOwners);
router.route("/oneOwner/:id").get(contactController.getOneOwner);
router.route("/createOwner").post(contactController.postOwner);
router.route("/editOwner/:id").put(contactController.editOwner);
router.route("/deleteOwner/:id").delete(contactController.deleteOwner);

module.exports = router;
