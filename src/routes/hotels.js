const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const hotelController = require("../controllers/hotel");

router.get("", verifyToken, hotelController.getHotels);
router.post("/reserve", verifyToken, hotelController.reserveRoom);
router.get("/getRoom", verifyToken, hotelController.getHotelRoom);


module.exports = router;
