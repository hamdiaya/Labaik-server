const express = require("express");
const router = express.Router();
const doc_controller = require('../controllers/doc_auth');
const docVerifyToken = require('../middleware/doctorVerifyToken');



router.post('/login',  doc_controller.login);
router.post('/logout', docVerifyToken, doc_controller.logout);

module.exports=router;