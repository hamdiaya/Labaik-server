const express = require("express");
const router = express.Router();
const agentInfosController = require("../controllers/agent_manage");
const verifyAgentToken = require("../middleware/agentTokenVerification");


router.get('/getAgentInfo', verifyAgentToken, agentInfosController.getAgentInfo);
router.get('/dossier_verification',verifyAgentToken,agentInfosController.getCandidatesByCommune);
router.get('/:id', verifyAgentToken,agentInfosController.getCandidateById);
router.get('/search', verifyAgentToken,agentInfosController.searchCandidatesByNationalID);

module.exports=router;