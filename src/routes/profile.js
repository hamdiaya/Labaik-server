const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const profileController = require('../controllers/profile_candidat');
router.get('/profile', verifyToken, profileController.getProfile);
module.exports=router;