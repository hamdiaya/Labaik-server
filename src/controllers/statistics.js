const supabase = require("../config/database");
const candidat = require("../models/candidat");
const selected_candidat = require("../models/selected_candidat");
const statistics_controller = {
  getStatistics: async (req, res) => {
    let wilayas = [];
    const requests = [
      candidat.getTotalNumberOfCandidat(),
      selected_candidat.getTotalNumberOfAcceptedCandidat(),
      selected_candidat.getTotalNumberOfAcceptedCandidatAfterMedicalVisite(),
      selected_candidat.getTotalNumberOfAcceptedCandidatPayé(),
    ];
    const response = await Promise.all(requests);

    const request2 = [];
    for (let i = 1; i <= 58; i++) {
      request2.push(
        candidat.getNumberOfCandidatOfWilaya(i),
        selected_candidat.getTotalNumberOfAcceptedCandidatOfWilaya(i),
        selected_candidat.getTotalNumberOfAcceptedCandidatAfterMedicalVisiteOfWilaya(
          i
        ),
        selected_candidat.getTotalNumberOfAcceptedCandidatPayéOfWilaya(i)
      );
    }
    const response1 = await Promise.all(request2);
    for (let i = 0; i < 232; i += 4) {
      wilayas.push({
        wilaya: Math.floor(i / 4) + 1,
        totalCandidatsOfWilaya: response1[i + 0],
        totalAcceptedCandidatsOfWilaya: response1[i + 1],
        totalAcceptedCandidatsByDoctorOfWilaya: response1[i + 2],
        totalAcceptedCandidatsPayéOfWilaya: response1[i + 3],
      });
    }
    console.log(wilayas);
    res.status(200).json({
      totalCandidats: response[0],
      totalAcceptedCandidats: response[1],
      totalAcceptedCandidatsByDoctor: response[2],
      totalAcceptedCandidatsPayé: response[3],
      wilayas,
    });
  },
};
module.exports = statistics_controller;
