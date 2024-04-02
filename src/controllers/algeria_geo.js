// controllers/AlgeriaCitiesController.js
const supabase = require("../config/database");

const AlgeriaGeoController = {
  getWilayas: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("communes")
        .select("commune_name, wilaya_code")
        .order("wilaya_code");

      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      const uniqueWilayaCodes = new Set();
      const distinctWilayas = [];

      // Iterate over the data and filter out duplicates
      data.forEach((item) => {
        if (!uniqueWilayaCodes.has(item.wilaya_code)) {
          uniqueWilayaCodes.add(item.wilaya_code);
          distinctWilayas.push(item);
        }
      });
      console.log(distinctWilayas);
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
 
};

module.exports = AlgeriaGeoController;
