
const express = require("express");
const router = express.Router();
const adminVerifyToken=require('../middleware/adminVerifyToken');
const admin_controller = require('../controllers/auth_admin');


router.post('/login', admin_controller.login);
router.post('/logout', adminVerifyToken, admin_controller.logout);
module.exports=router;