const express = require("express");

const router = express.Router();

const recoController = require("../Controllers/recoController");

router.route("/getReco").get(recoController.getReco);
router.route("/oneReco/:id").get(recoController.getOneReco);
router.route("/createReco").post(recoController.createReco);

module.exports = router;
