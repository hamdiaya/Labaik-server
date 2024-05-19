const supabase = require("../config/database");
const candidat = require("../models/candidat");
const selected_candidat = require("../models/selected_candidat");
const statistics_controller = {
  getStatistics: async (req, res) => {
    let wilayas = [];
    const totalCandidats = await candidat.getTotalNumberOfCandidat();
    if (totalCandidats == "error") {
      res.status(404).json("error fetching statistics");
    }
    const totalAcceptedCandidats =
      await selected_candidat.getTotalNumberOfAcceptedCandidat();
    if (totalAcceptedCandidats == "error") {
      res.status(404).json("error fetching statistics");
    }
    const totalAcceptedCandidatsByDoctor =
      await selected_candidat.getTotalNumberOfAcceptedCandidatAfterMedicalVisite();
    if (totalAcceptedCandidatsByDoctor == "error") {
      res.status(404).json("error fetching statistics");
    }
    const totalAcceptedCandidatsPayé =
      await selected_candidat.getTotalNumberOfAcceptedCandidatPayé();
    if (totalAcceptedCandidatsPayé == "error") {
      res.status(404).json("error fetching statistics");
    }
    for (let i = 1; i <= 58; i++) {
      var totalCandidatsOfWilaya = await candidat.getNumberOfCandidatOfWilaya(
        i
      );
      if (totalCandidatsOfWilaya == "error") {
        res.status(404).json("error fetching statistics");
      }

      var totalAcceptedCandidatsOfWilaya =
        await selected_candidat.getTotalNumberOfAcceptedCandidatOfWilaya(i);
      if (totalAcceptedCandidatsOfWilaya == "error") {
        res.status(404).json("error fetching statistics");
      }

      var totalAcceptedCandidatsByDoctorOfWilaya =
        await selected_candidat.getTotalNumberOfAcceptedCandidatAfterMedicalVisiteOfWilaya(
          i
        );
      if (totalAcceptedCandidatsByDoctorOfWilaya == "error") {
        res.status(404).json("error fetching statistics");
      }
      var totalAcceptedCandidatsPayéOfWilaya =
        await selected_candidat.getTotalNumberOfAcceptedCandidatPayéOfWilaya(i);
      if (totalAcceptedCandidatsPayéOfWilaya == "error") {
        res.status(404).json("error fetching statistics");
      }
      wilayas.push({
        wilaya: i,
        totalCandidatsOfWilaya: totalCandidatsOfWilaya,
        totalAcceptedCandidatsOfWilaya: totalAcceptedCandidatsOfWilaya,
        totalAcceptedCandidatsByDoctorOfWilaya:
          totalAcceptedCandidatsByDoctorOfWilaya,
        totalAcceptedCandidatsPayéOfWilaya: totalAcceptedCandidatsPayéOfWilaya,
      });
    }
    res.status(200).json({
      totalCandidats,
      totalAcceptedCandidats,
      totalAcceptedCandidatsByDoctor,
      totalAcceptedCandidatsPayé,
      wilayas,
    });
  },
};
module.exports = statistics_controller;
