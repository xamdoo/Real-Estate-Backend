const express = require("express");

const router = express.Router();

const UserController = require("../Controllers/UserController");
const scheduleController = require("../Controllers/ScheduleController");

router
  .route("/makeSchedule")
  .post(UserController.protect, scheduleController.makeSchedule);
router.route("/scheduleList").get(scheduleController.scheduleList);
router.route("/oneSchedule/:id").get(scheduleController.oneSchedule);

module.exports = router;
