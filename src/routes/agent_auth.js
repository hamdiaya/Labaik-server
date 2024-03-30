const express = require("express");
const router = express.Router();
const agent_controller = require('../controllers/agent_auth');


router.post('/login',  agent_controller.login);

module.exports=router;