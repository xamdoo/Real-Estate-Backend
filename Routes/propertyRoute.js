const express = require("express");

const router = express.Router();

const propertyController = require("../Controllers/propertyController");
const UserController = require("../Controllers/UserController");

router.route("/houseList").get(propertyController.houseList);
router.route("/search").get(propertyController.findSearchedProperties);
router.route("/oneHouse/:id").get(propertyController.oneHouse);
router.route('/properties').get(propertyController.getMultipleProperties)
router.route('/listings').get(UserController.protect, propertyController.getAgentListings)

router
  .route("/postHouse")
  .post(UserController.protect, propertyController.postHouse);
router.route("/updateHouse/:id").put(propertyController.updateHouse);
router.route("/deleteHouse/:id").delete(propertyController.deleteHouse);

module.exports = router;
