const express = require("express");
const router = express.Router();
const adminverifyToken = require('../middleware/adminVerifyToken');
const verifyAgentToken = require("../middleware/agentTokenVerification");
const verifyToken = require('../middleware/verifyToken');
const notification_controller = require('../controllers/notification_controller');


router.post('/admin/sendNotification',adminverifyToken, notification_controller.sendNotification);
router.post('/agent/sendNotification',verifyAgentToken, notification_controller.sendNotification);
router.get('/getNotifications',verifyToken,notification_controller.fetchNotifications);
module.exports=router;