const supabase = require("../config/database");
const selectedCandidats = require("../models/selected_candidat");
const hadj = require("../models/candidat");
const docManagementController = {
  getCandidatesByCommune: async (req, res) => {
    try {
      const doc_commune = req.decoded.commune;

      const { data: candidates, error } = await supabase
        .from("selected_candidats")
        .select("*")
        .eq("commune", doc_commune);

      if (error) {
        throw error;
      }

      if (!candidates) {
        return res.status(404).json({
          message: "No current candidates found for the logged-in agent",
        });
      }

      // Extract candidate names from the filtered query result
      var responseData = [];
      candidates.forEach((element) => {
        responseData.push({
          id: element.id,
          firstName: element.first_name,
          lastName: element.last_name,
          doctor: element.doctor,
        });
      });
      console.log(responseData);
      res.status(200).json({ candidates: responseData });
    } catch (error) {
      console.error("Error fetching candidates by commune:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getCandidateById: async (req, res) => {
    try {
      const candidateId = req.params.id;

      const candidate = await selectedCandidats.findById(candidateId);
      const candidat = await hadj.findById(candidateId);
      const { data: medicalRecord, error } = await supabase
        .from("medical_records")
        .select("*")
        .eq("candidate_id", candidateId);
      console.log(medicalRecord);

      if (!candidate) {
        return res.status(404).json({ error: "Candidate not found" });
      }
      if (!candidat) {
        return res.status(404).json({ error: "Candidate not found" });
      }
      if (!medicalRecord || !medicalRecord.id) {
        res.status(200).json({
          fullName: candidat.firstName_ar + " " + candidat.lastName_ar,
          gender: candidat.sexe,
          dateOfBirth: candidat.date_of_birth,
          medicalHistory: false,
          sickNature: "",
          acceptedHealthState: false,
          medicines: "",
          note: "",
        });
      } else {
        // Send the candidate information in the response
        res.status(200).json({
          fullName: candidat.firstName_ar + " " + candidat.lastName_ar,
          gender: candidat.sexe,
          dateOfBirth: candidat.date_of_birth,
          medicalHistory: candidate[0].diseased,
          sickNature: medicalRecord[0].disease,
          acceptedHealthState: medicalRecord[0].passed,
          medicines: medicalRecord[0].medicines,
          note: medicalRecord[0].note,
        });
      }
    } catch (error) {
      console.error("Error fetching candidate by ID:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  updateMedicalRecords: async (req, res) => {
    try {
      const { acceptedHealthState,sickNature,   medicalHistory, note, medicines } = req.body;
      const selectedCandidateId = req.params.id;

      const {
        data: selectedCandidateUpdateData,
        error: selectedCandidateUpdateError,
      } = await supabase
        .from("selected_candidats")
        .update({ doctor: acceptedHealthState })
        .eq("id", selectedCandidateId);

      if (selectedCandidateUpdateError) {
        throw selectedCandidateUpdateError;
      }

      // Insert medical record into medical_records table
      const { data, error } = await supabase.from("medical_records").upsert(
        [
          {
            passed: acceptedHealthState,
            medicalHistory,
            sickNature,
            medicines,
            note,
            candidate_id: selectedCandidateId,
          },
        ],
        { onConflict: ["candidate_id"] }
      );

      if (error) {
        throw error;
      }

      res
        .status(200)
        .json({ message: "Medical records updated successfully." });
    } catch (error) {
      console.error("Error updating medical records:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = docManagementController;
