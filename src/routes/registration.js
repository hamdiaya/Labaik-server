const express = require("express");
const router = express.Router();

const registration_controller = require('../controllers//registration');

router.post('/setCandidatInfo',registration_controller.setCandidatInfo);
router.post('/addMahram', registration_controller.addMahram);
module.exports=router;