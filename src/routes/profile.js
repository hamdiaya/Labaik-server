const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const profileController = require('../controllers/profile_candidat');


router.get('', verifyToken, profileController.getProfile);
router.get('/mahram', verifyToken, profileController.getMahram);
router.get('/maharim', verifyToken, profileController.getCandidatesForMahram);

module.exports=router;