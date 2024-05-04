const express = require("express");
const router = express.Router();
const agentInfosController = require("../controllers/agent_manage");
const verifyAgentToken = require("../middleware/agentTokenVerification");
const fileController = require("../controllers/fileController");

router.get('/getAgentInfo', verifyAgentToken, agentInfosController.getAgentInfo);
router.get('/dossier_verification',verifyAgentToken,agentInfosController.getCandidatesByCommune);
router.get('/:id', verifyAgentToken,agentInfosController.getCandidateById);
router.post('/:id/accept', verifyAgentToken,agentInfosController.dossierValidation );
router.get('/:id/fetchFiles', verifyAgentToken, fileController.getDocumentsForUser);
module.exports=router;