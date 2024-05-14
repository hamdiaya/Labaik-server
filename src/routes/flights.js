const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const flightsController = require('../controllers/haj_flights');


router.get('', verifyToken, flightsController.getFlights);
router.post('/reserve', verifyToken, flightsController.reserveFlight);


module.exports=router;