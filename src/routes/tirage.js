
const express = require("express");
const router = express.Router();

const tirage_controller = require('../controllers/tirage_controller');


router.post('/tirage', tirage_controller.tirage);
router.post('/getCandidats',  tirage_controller.getCandidats);
module.exports=router;