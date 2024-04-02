const hadjInfo = require("../models/hadj_info");

const hadjInfoController = {
  setHadjInfo: async (req, res) => {
    const {
      year,
      total_places,
      la_date_de_tirage,
      heure_de_tirage,
      algorithm,
    } = req.body;
    try {
      const data = await hadjInfo.addHadjInfo(
        year,
        total_places,
        la_date_de_tirage,
        heure_de_tirage,
        algorithm
      );
      console.log(data);
      if (data != null) {
        return res
          .status(400)
          .json("informations of el hadj this year are already setted");
      } else {
        const data2 = await hadjInfo.setHadjFormule(year);
        if (data2 == "Formule updated successfully for year") {
       
          res.status(200).json("hadj info setted");
        } else {
          res.status(404).json(data2.toString());
        }
      }
    } catch (error) {
      res.status(404).json(error);
    }
  },

  updateThePlaces: async (req, res) => {
    const { year } = req.body;
    try {
      const data = await hadjInfo.updatePlacesDisponiblesOfCommune(year);
      console.log(data);
      if (data == "Places disponibles updated successfully for year:") {
        const data2 = await hadjInfo.updatePlacesDisponiblesOfWilaya();
        if (data2 == "wilayas places updated") {
          res.status(200).json("places updated successfully");
        } else {
          res.status(404).json(data2.toString());
        }
      } else {
        res.status(404).json(data.toString());
      }
    } catch (error) {
      res.status(404).json(error);
    }
  },
  getCommunes: async (req, res) => {
    var { wilaya_code } = req.body;
    if (wilaya_code.length == 1) {
      wilaya_code = "0" + wilaya_code;
    }
    try {
      const data = await hadjInfo.getCommunes(wilaya_code);
      if (data == "error fetching communes" || data == "error") {
        res.status(404).json(data);
      } else {
        res.status(200).json(data);
      }
    } catch (error) {
      console.log(error);
      res.status(404).json(error);
    }
  },
  getHadjInfo: async (req, res) => {
    const { year } = req.body;
    try {
      const data = await hadjInfo.getHadjInfo(year);
      if (data == "error" || data == "hadj info not found") {
        res.status(404).json(data.toString());
      } else {
        res.status(200).json(data);
      }
    } catch (error) {
      res.status(404).json(error);
    }
  },
};
module.exports = hadjInfoController;
