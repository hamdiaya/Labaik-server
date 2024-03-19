const express = require("express");
const router = express.Router();

const auth_candidat = require('../controllers/auth_candidat');

router.post('/signup', auth_candidat.signUp);
module.exports=router;