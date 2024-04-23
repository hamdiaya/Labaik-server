const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const registration_controller = require('../controllers//registration');
const fileController = require("../controllers/fileController");
const uploadMiddleware = require("../middleware/uploadMiddleware");

router.post('/setCandidatInfo',verifyToken,registration_controller.setCandidatInfo);
router.post('/addMahram',verifyToken, registration_controller.addMahram);
router.post('/getCitiesByWilaya',registration_controller.getCitiesByWilaya);
router.post("/upload", uploadMiddleware, fileController.uploadFile );
module.exports=router;