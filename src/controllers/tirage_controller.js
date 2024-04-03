const supabase = require("../config/database");
const selected_candidat = require("../models/selected_candidat");

const tirage_controller = {
  tirage: async (req, res) => {
    try {
      let { candidats, places } = req.body;

      if (places - 2 < 0) {
        candidats = candidats.filter((item) => item.sexe !== "female");
      }

      const randomIndex = Math.floor(Math.random() * candidats.length);
      const randomObject = candidats[randomIndex];

      if (randomObject.sexe === "female") {
        // If female selected
        const selectedCandidats = [randomObject];
        const mahram = candidats.find(
          (item) => item.numéro_nationale === randomObject.numéro_nationale_mahram
        );
        if (mahram) selectedCandidats.push(mahram);

        for (const candidat of selectedCandidats) {
          const data = await selected_candidat.addSelectedCnadidat(
            candidat.id,
            candidat.commune_résidence
          );
          if (data === "error") {
            throw new Error("Error saving selected candidat");
          }
          places -= 1;
          candidats = candidats.filter((item) => item !== candidat);
        }
      } else {
        // If male selected
        const data = await selected_candidat.addSelectedCnadidat(
          randomObject.id,
          randomObject.commune_résidence
        );
        if (data === "error") {
          throw new Error("Error saving selected candidat");
        }
        places -= 1;
        candidats = candidats.filter((item) => item !== randomObject);
      }

      const selectingData = {
        places: places,
        candidats: candidats,
        selected1: randomObject,
        selected2: randomObject.sexe === "female" ? mahram : null,
      };

      res.status(200).json(selectingData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getCandidats: async (req, res) => {
    try {
      const { data, error } = await supabase.from("candidats_duplicate").select("*");
      if (error) {
        throw new Error("Error fetching candidats");
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = tirage_controller;
