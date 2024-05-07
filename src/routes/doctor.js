const express = require("express");
const router = express.Router();
const docManagementController = require("../controllers/doc_manage");
const verifyDocToken = require("../middleware/doctorVerifyToken");


router.get('/getSelectedCandidates', verifyDocToken, docManagementController.getCandidatesByCommune);
router.get('/:id',verifyDocToken,docManagementController.getCandidateById);
router.post('/:id/updateRecords', verifyDocToken,docManagementController.updateMedicalRecords )
module.exports=router;