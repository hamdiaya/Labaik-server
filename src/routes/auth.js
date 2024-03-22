const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const auth_candidat = require('../controllers/auth_candidat');
const profileController = require('../controllers/profile_candidat');
const adminController = require('../controllers/auth_admin');


router.post('/signup', auth_candidat.signUp);
router.post('/sendConfirmationCode',auth_candidat.sendConfirmationCode);
router.post('/verifyConfirmationCode',auth_candidat.verifyConfirmationCode);
router.post('/setCandidatInfo',auth_candidat.setCandidatInfo);
router.post('/login', auth_candidat.login);
router.post('/logout', verifyToken, auth_candidat.logout);//using verifyTokennensures that only authenticated users with a valid JWT token can logout. If the token is not valid or missing, the request will be blocked, and the user won't be able to logout.
router.get('/profile', verifyToken, profileController.getProfile);

router.post('/admin/login', adminController.login);

module.exports=router;