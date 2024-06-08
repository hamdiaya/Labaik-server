const Agent = require("../models/agent");
const supabase = require("../config/database");
const Candidat = require("../models/candidat");

const agentInfosController = {
  getAgentInfo: async (req, res) => {
    try {
      // Decode the token to extract the agent's username
      const decodedToken = req.decoded;
      const agentUsername = decodedToken.username;

      // agent information based on the username
      const agentInfo = await Agent.findByUsername(agentUsername);

      //  commune and wilaya details for the agent
      const commune = await supabase
        .from("communes")
        .select("*")
        .eq("commune_name", agentUsername)
        .single();

      const wilaya = await supabase
        .from("wilayas")
        .select("*")
        .eq("wilaya_code", commune.data.wilaya_code)
        .single();

      // Fetch latest HajInfo for the agent
      const { data: latestHajInfos, error: hajInfoError } = await supabase
        .from("hadj_info")
        .select("*")
        .order("id", { ascending: false })
        .limit(1);
      if (hajInfoError) {
        throw hajInfoError;
      }

      // Construct response object with agent information
      const agentResponse = {
        id: agentInfo.id,
        username: agentInfo.username,
        commune: commune.data,
        wilaya: wilaya.data,
        latestHajInfo: latestHajInfos,
      };

      res.json(agentResponse);
    } catch (error) {
      console.error("Error fetching agent information:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getCandidatesByCommune: async (req, res) => {
    try {
      // Extract commune residence (username) of the logged-in agent
      const agentUsername = req.decoded.username;
      console.log(agentUsername);
      const { data: candidates, error } = await supabase
        .from("candidats_duplicate")
        .select("*")
        .eq("commune_résidence", agentUsername)
        .eq("documentsUploaded", true);

      if (error) {
        throw error;
      }

      // Filter candidates based on the 'current' column
      const filteredCandidates = candidates.filter(
        (candidate) => candidate.current === true
      );

      // Check if there are no current candidates
      if (!filteredCandidates || filteredCandidates.length === 0) {
        return res.status(404).json({
          message: "No current candidates found for the logged-in agent",
        });
      }

      // Extract candidate names from the filtered query result
      var responseData = [];
      filteredCandidates.forEach((element) => {
        console.log(element);
        responseData.push({
          id: element.id,
          firstName: element.firstName_ar,
          lastName: element.lastName_ar,
          state: element.dossier_valide,
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
      const candidateId = req.params.id; // Extract candidate ID from request parameters
      // Retrieve candidate information by ID using the Candidat model
      const candidate = await Candidat.findById(candidateId);

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

  dossierValidation: async (req, res) => {
    const candidateId = req.params.id;
    const validatedResult = req.body.validated_result;
    const candidate = await Candidat.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({ error: "Candidatnot found" });
    }
    try {
      const updatedCandidate =
        await Candidat.updateCandidateDossierVerification(
          candidateId,
          validatedResult
        );

      res
        .status(200)
        .json("Candidate dossier verification status updated successfully");
    } catch (error) {
      console.error("Error accepting candidate verification:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getWinners: async (req, res) => {
    try {
      const decodedToken = req.decoded;
      const agentUsername = decodedToken.username;

      const { data: candidates, error } = await supabase
        .from("selected_candidats")
        .select("*")
        .eq("commune", agentUsername);
      if (error) {
        throw error;
      }

      if (!candidates) {
        return res.status(404).json({
          message: "No current candidates found for the logged-in agent",
        });
      }

      // Extract candidate names from the filtered query result
      console.log(candidates);
      res.status(200).json(candidates);
    } catch (error) {
      console.error("Error fetching winners", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = agentInfosController;
