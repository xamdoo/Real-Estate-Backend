const express = require("express");

const router = express.Router();

const propertyController = require("../Controllers/propertyController");

router.route("/houseList").get(propertyController.houseList);
router.route("/oneHouse/:id").get(propertyController.oneHouse);
router.route("/rentHouses").get(propertyController.rentHouses);
router.route("/saleHouses").get(propertyController.saleHouses);
router.route("/postHouse").post(propertyController.postHouse);
router.route("/updateHouse/:id").put(propertyController.updateHouse);
router.route("/deleteHouse/:id").delete(propertyController.deleteHouse);

module.exports = router;
