const express = require("express");
const router = express.Router();
const adminverifyToken = require("../middleware/adminVerifyToken");
const verifyAgentToken = require("../middleware/agentTokenVerification");
const verifyToken = require("../middleware/verifyToken");
const notification_controller = require("../controllers/notification_controller");

router.post(
  "/admin/sendNotificationToCnadidate",
  adminverifyToken,
  notification_controller.sendNotificationToASpecificCandidate
);
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
  "/admin/sendNotificationToAllCandidates",
  adminverifyToken,
  notification_controller.sendNotificationToAllCandidates
);
router.get(
  "/getNotifications",
  verifyToken,
  notification_controller.fetchNotifications
);
module.exports = router;
