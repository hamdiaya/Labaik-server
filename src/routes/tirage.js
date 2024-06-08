const express = require("express");
const router = express.Router();
const verifyAgentToken = require("../middleware/agentTokenVerification");
const tirage_controller = require("../controllers/tirage_controller");
const agent_manage = require("../controllers/agent_manage");

router.post("/tirage", tirage_controller.tirage);
router.get("/getCandidats", verifyAgentToken, tirage_controller.getCandidats);
router.get("/getSelectedCandidats", tirage_controller.getAllselectedCandidates);
router.get("/getWinnersOfCommune", verifyAgentToken, agent_manage.getWinners);
module.exports = router;
