const express = require("express");
const router = express.Router();

const auth_candidat = require('../controllers/auth_candidat');

router.post('/signup', auth_candidat.signUp);
router.post('/sendConfirmationCode',auth_candidat.sendConfirmationCode);
router.post('/verifyConfirmationCode',auth_candidat.verifyConfirmationCode);
router.post('/login', auth_candidat.login);
module.exports=router;