const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const registration_controller = require('../controllers//registration');

router.post('/setCandidatInfo',verifyToken,registration_controller.setCandidatInfo);
router.post('/addMahram',verifyToken, registration_controller.addMahram);
router.post('/getCitiesByWilaya',registration_controller.getCitiesByWilaya);
module.exports=router;