const express = require("express");
const router = express.Router();
const agentInfosController = require("../controllers/agent_infos");
const verifyAgentToken = require("../middleware/agentTokenVerification");


router.get('/getAgentInfo', verifyAgentToken, agentInfosController.getAgentInfo);
router.get('/dossier_verification',verifyAgentToken,agentInfosController.getCandidatesByCommune)

module.exports=router;