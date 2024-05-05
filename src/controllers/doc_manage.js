const supabase = require("../config/database");
const selectedCandidats = require("../models/selected_candidat");

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
        return res
          .status(404)
          .json({
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

      if (!candidate) {
        return res.status(404).json({ error: "Candidate not found" });
      }

      // Send the candidate information in the response
      res.status(200).json(candidate);
    } catch (error) {
      console.error("Error fetching candidate by ID:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  updateMedicalRecords: async (req, res) => {
    try {
      const { status, disease, diseased, note, medicines } = req.body;
      const selectedCandidateId = req.params.id;

      const {
        data: selectedCandidateUpdateData,
        error: selectedCandidateUpdateError,
      } = await supabase
        .from("selected_candidats")
        .update({ doctor: status })
        .eq("id", selectedCandidateId);

      if (selectedCandidateUpdateError) {
        throw selectedCandidateUpdateError;
      }

      // Insert medical record into medical_records table
      const { data, error } = await supabase
        .from('medical_records')
        .upsert([
          {
            passed:status,
            diseased,
            disease, 
            medicines,
            note,
            candidate_id: selectedCandidateId
          }
        ], { onConflict: ['candidate_id'] });

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
