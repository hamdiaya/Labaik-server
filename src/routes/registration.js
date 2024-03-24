const express = require("express");
const router = express.Router();
const fileController = require('../controllers/fileController');
const uploadMiddleware = require('../middleware/uploadMiddleware');



const registration_controller = require('../controllers//registration');

router.post('/setCandidatInfo',registration_controller.setCandidatInfo);
router.post('/addMahram', registration_controller.addMahram);
router.post('/upload', uploadMiddleware, fileController.uploadFile);


module.exports=router;