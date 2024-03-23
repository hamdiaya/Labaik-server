
const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const admin_controller = require('../controllers/auth_admin');


router.post('/login', admin_controller.login);

module.exports=router;