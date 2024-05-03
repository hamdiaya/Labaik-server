const express = require("express");
const router = express.Router();
const agent_controller = require('../controllers/agent_auth');
const agentVerifyToken = require('../middleware/agentTokenVerification');



router.post('/login',  agent_controller.login);
router.post('/logout', agentVerifyToken, agent_controller.logout);

module.exports=router;