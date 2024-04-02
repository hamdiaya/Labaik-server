
const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const auth_candidat = require('../controllers/auth_candidat');
const algeria_geo=require('../controllers/algeria_geo');

router.post('/signup', auth_candidat.signUp);
router.post('/sendConfirmationCode',verifyToken,auth_candidat.sendConfirmationCode);
router.post('/verifyConfirmationCode',verifyToken,auth_candidat.verifyConfirmationCode);
router.post('/logout', verifyToken, auth_candidat.logout);
router.post('/login', auth_candidat.login);
router.get('/getWilayas',algeria_geo.getWilayas);
router.post('/resetPassword', auth_candidat.resetPassword);
router.post('/sendResetToken', auth_candidat.sendResetToken);
router.post('/verifyResetToken', auth_candidat.verifyResetToken);
router.post('/getUserName', auth_candidat.getUserName);
module.exports=router;