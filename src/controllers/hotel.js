const selectedCandidats = require("../models/selected_candidat");
const hotel = require("../models/hotel");

const hotels = {
  getHotels: async (req, res) => {
    try {
        const hotels = await hotel.getHotels();
        res.status(200).json(hotels);
      } catch (error) {
        res.status(404).json({ error: error.message });
      }
    },
  

  reserveRoom: async (req, res) => {
    try {
      const userId = req.decoded.userId;
      haaj = await selectedCandidats.findById(userId);

      const {hotelId}= req.body;

      if (haaj == null) {
        return res.status(200).json({ error: "Missing candidat" });
      }
    
      if (haaj?.hotel_room) {
        return res
          .status(200)
          .json({ error: "Haj has already reserved a hotel room" });
      }
      if (!hotelId) {
        return res.status(200).json({ error: "Missing hotelId" });
      }
      
      const data = await hotel.getHotelById(hotelId)
      
      if (!data) {
        return res.status(404).json({ error: "hotel not found" });
      }
      
      if (data.number_of_rooms >= data.total_number_of_rooms) {
        return res.status(200).json({ error: "hotel is full" });
      }


    data[0].number_of_rooms++;

      await hotel.updateHotel(data[0]);

      haaj.hotel_room = hotelId;
      haaj.hotel = true;
      await selectedCandidats.updateHotel(haaj);

      return res.status(200).json({ message: "hotel reservation successful" });
    } catch (error) {
      res.status(404).json(error);
    }
  },

  getHotelRoom: async (req, res) => {
    try {
      const userId = req.decoded.userId;
      haaj = await selectedCandidats.findById(userId);

      if (!haaj.hotel) {
        return res
          .status(200)
          .json({ message: "You haven't reserved a room yet." });
      }

      const data = await hotel.getHotelById(haaj.hotel_room);
      res.status(200).json(data[0]);
    } catch (error) {
      res.status(404).json(error);
    }
  },
};
module.exports = hotels;
