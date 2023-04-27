const express = require("express");

const router = express.Router();

const ownerControllers = require("../Controllers/OwnerControllers");

router.route("/ownerList").get(ownerControllers.ownerList);
router.route("/oneOwner/:id").get(ownerControllers.oneOwner);
router.route("/createOwner").post(ownerControllers.postOwner);
router.route("/editOwner/:id").put(ownerControllers.editOwner);
router.route("/deleteOwner/:id").delete(ownerControllers.deleteOwner);

module.exports = router;
