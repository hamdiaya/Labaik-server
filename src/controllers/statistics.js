const supabase = require("../config/database");
const candidat = require("../models/candidat");
const selected_candidat = require("../models/selected_candidat");
const statistics_controller = {
  getStatistics: async (req, res) => {
    let wilayas=[];
    const totalCandidats = await candidat.getTotalNumberOfCandidat();
    const totalAcceptedCandidats =
      await selected_candidat.getTotalNumberOfAcceptedCandidat();
    const totalAcceptedCandidatsByDoctor =
      await selected_candidat.getTotalNumberOfAcceptedCandidatAfterMedicalVisite();
    const totalAcceptedCandidatsPayé =
      await selected_candidat.getTotalNumberOfAcceptedCandidatPayé();
      for (let i = 1; i <= 58; i++) {
       var totalCandidatsOfWilaya=await candidat.getNumberOfCandidatOfWilaya(i);
       var totalAcceptedCandidatsOfWilaya=await selected_candidat.getTotalNumberOfAcceptedCandidatOfWilaya(i);
       var totalAcceptedCandidatsByDoctorOfWilaya=await selected_candidat.getTotalNumberOfAcceptedCandidatAfterMedicalVisiteOfWilaya(i);
       var totalAcceptedCandidatsPayéOfWilaya=await selected_candidat.getTotalNumberOfAcceptedCandidatPayéOfWilaya(i);

       wilayas.push({
        wilaya:i,
        totalCandidatsOfWilaya:totalCandidatsOfWilaya,
        totalAcceptedCandidatsOfWilaya: totalAcceptedCandidatsOfWilaya,
        totalAcceptedCandidatsByDoctorOfWilaya: totalAcceptedCandidatsByDoctorOfWilaya,
        totalAcceptedCandidatsPayéOfWilaya: totalAcceptedCandidatsPayéOfWilaya,
       });
      }
    res
      .status(200)
      .json({
        totalCandidats,
        totalAcceptedCandidats,
        totalAcceptedCandidatsByDoctor,
        totalAcceptedCandidatsPayé,
       wilayas
      });
  },
};
module.exports = statistics_controller;
