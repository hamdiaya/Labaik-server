
const express = require("express");
const router = express.Router();
const verifyAgentToken = require("../middleware/agentTokenVerification");
const tirage_controller = require('../controllers/tirage_controller');


router.post('/tirage', tirage_controller.tirage);
router.get('/getCandidats',verifyAgentToken,  tirage_controller.getCandidats);
router.get('/getSelectedCandidats',  tirage_controller.getAllselectedCandidates);
module.exports=router;