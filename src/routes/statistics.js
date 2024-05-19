const express = require("express");
const router = express.Router();
const statistics_controller=require('../controllers/statistics');
router.get("/total", statistics_controller.getStatistics );
module.exports=router;