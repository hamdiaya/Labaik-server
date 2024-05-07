
const express = require("express");
const router = express.Router();
const verifyAgentToken = require("../middleware/agentTokenVerification");
const payment_controller = require('../controllers/payment_controller');



router.get('/getCandidats',verifyAgentToken,  payment_controller.getCandidatesWithMedicalAccepted);
router.post('/changePaymentState',verifyAgentToken,  payment_controller.changePaymentState);
module.exports=router;