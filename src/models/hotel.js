const supabase = require("../config/database");

const hotel = {
  getHotels: async () => {
    try {
        const { data, error } = await supabase
        .from('hotels')
        .select('*');
    
      if (error) {
        throw error;
      }
    
      return data;}
      catch (error) {
        console.error("Error updating vol:", error);
        throw error;

      }

},

getHotelById: async (hotelId) => {
  try {
    
    const { data, error } = await supabase
      .from("hotels") 
      .select("*")
      .eq("id", hotelId); 
   

    if (error) {
      console.error("Error fetching hotel by ID:", error);
      throw new Error("Failed to fetch hotel data"); 
    }

    return data;
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error; 
  }
},

  updateHotel: async (hotel) => {
    try {
      const { data, error } = await supabase
        .from("hotels")
        .update({ number_of_rooms: hotel.number_of_rooms })
        .eq("id", hotel.id);

      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      console.error("Error updating hotel:", error);
      throw error;
    }
  },


};

module.exports = hotel;
