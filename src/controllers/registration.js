const candidat = require("../models/candidat");
const moment = require("moment");
const supabase = require("../config/database");
const registration_controller = {
  setCandidatInfo: async (req, res) => {
    const userId = req.decoded.userId;

    // Fetch user profile from the database
    const userc = await candidat.findById(userId);
    if (!userc || !userc.email) {
      res.status(400).json("user not found");
    }

    const email = userc.email;
    const {
      firstName_fr,
      lastName_fr,
      sexe,
      date_of_birth,
      numéro_national,
      father_name_arabe,
      mother_first_name_arabe,
      mother_last_name_arabe,
      wilaya_résidence,
      commune_résidence,
      ancienté,
    } = req.body;
    try {
      const formattedDate = moment(date_of_birth, "YYYY-MM-DD").format(
        "YYYY-MM-DD"
      );
      const result = await candidat.setCandidatInfo(
        email,
        firstName_fr,
        lastName_fr,
        sexe,
        formattedDate,
        numéro_national,
        father_name_arabe,
        mother_first_name_arabe,
        mother_last_name_arabe,
        wilaya_résidence,
        commune_résidence,
        ancienté
      );
      if (result == "candidate informations added successfully") {
        res.status(200).json({ message: "Candidat info updated successfully" });
      } else {
        res.status(404).json({ error: result.toString() });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  addMahram: async (req, res) => {
    const userId = req.decoded.userId;

    // Fetch user profile from the database
    const userc = await candidat.findById(userId);
    console.log(userc);
    if (!userc || !userc.email) {
      res.status(400).json("user not found");
    }

    const email = userc.email;
    console.log(email);
    const { numéro_national_mahram, relation_with_mahram } = req.body;
    try {
      const existingUser = await candidat.findUserByemail(email);

      if (!existingUser || !existingUser.email) {
        // If user doesn't exist, return a 404 error
        return res.status(404).json({ error: "User not found" });
      }
      if (existingUser.numéro_national == numéro_national_mahram) {
        return res
          .status(404)
          .json({ error: "numéro national mahram must be diffrent of yours" });
      }
      const data = await candidat.linkToMahram(
        email,
        numéro_national_mahram,
        relation_with_mahram
      );
      if (data == " Successfully linked to Mahram") {
        return res.status(200).json("mahram added");
      } else {
        return res.status(404).json({ message: data.toString() });
      }
    } catch (error) {}
  },
  getCitiesByWilaya: async (req, res) => {
    var { wilayaCode } = req.body;
if(wilayaCode.length==1){
  wilayaCode='0'+wilayaCode;
}
console.log(wilayaCode);
    try {
      const { data, error } = await supabase
        .from("communes")
        .select("commune_name")
        .eq("wilaya_code", wilayaCode);
console.log(data);
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      console.log(data);
      if (data != null) {
        return res.status(200).json(data);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
module.exports = registration_controller;
