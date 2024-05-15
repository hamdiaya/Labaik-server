const express = require("express");
const router = express.Router();
const doctorVerifyToken = require("../middleware/doctorVerifyToken");
const verifyAgentToken = require("../middleware/agentTokenVerification");
const verifyToken = require("../middleware/verifyToken");
const adminVerifyToken=require("../middleware/adminVerifyToken");
const notification_controller = require("../controllers/notification_controller");



router.post(
  "/agent/sendNotificationToCnadidate",
  verifyAgentToken,
  notification_controller.sendNotificationToASpecificCandidate
);
router.post(
  "/agent/sendNotificationToCommuneCandidates",
  verifyAgentToken,
  notification_controller.sendNotificationToCommuneCandidates
);
router.post(
  "/doctor/sendNotificationToCandidate",
 doctorVerifyToken,
  notification_controller.sendNotificationToASpecificCandidate
);
router.post(
  "/admin/sendNotificationToAgents",
 adminVerifyToken,
  notification_controller.sendNotificationToAgents,
);
router.get(
  "/getNotifications",
  verifyToken,
  notification_controller.fetchNotifications
);
router.get(
  "/agent/getNotifications",
  verifyAgentToken,
  notification_controller.fetchNotificationOfAgent
);
router.post(
  "/changeNotificationState",
 verifyToken,
  notification_controller.makeNotificationSeen,
);
router.post(
  "/agent/changeNotificationState",
verifyAgentToken,
  notification_controller.makeNotificationSeen,
);
module.exports = router;
