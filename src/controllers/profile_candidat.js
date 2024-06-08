const jwt = require("jsonwebtoken");
const user = require("../models/candidat");
const secretKey = "aaichraqisthebestjaaeyeuenkjdvnkjbnhhjhsdkfbkjnikqsd";
const selected_candidat = require("../models/selected_candidat");
const hadjInfo = require("../models/hadj_info");
const profile_controller = {
  getProfile: async (req, res) => {
    try {
      // Extract user details from token
      const token = req.cookies.token;
      const decoded = jwt.verify(token, secretKey);
      const userId = decoded.userId;
      // Fetch user profile from the database
      const userc = await user.findById(userId);

      // Send profile data in the response
      res.status(200).json(userc);
    } catch (error) {
      console.error("Error fetching profile:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getMahram: async (req, res) => {
    try {
      const token = req.cookies.token;
      const decoded = jwt.verify(token, secretKey);
      const userId = decoded.userId;

      const userc = await user.findById(userId);

      if (userc.numéro_nationale_mahram) {
        const mahram = await user.findUserByNuméroNationale(
          userc.numéro_nationale_mahram
        );
        const { relation_with_mahram } = userc;
        const { firstName_ar, lastName_ar, numéro_national } = mahram;

        mahram_firstName_ar = firstName_ar;
        mahram_lastName_ar = lastName_ar;

        res.status(200).json({
          mahram_firstName_ar,
          mahram_lastName_ar,
          numéro_national,
          relation_with_mahram,
        });
      } else {
        res.status(200).json({ message: "User does not have a mahram ID set" });
      }
    } catch (error) {
      console.error("Error fetching profile:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getCandidatesForMahram: async (req, res) => {
    try {
      // Extract user details from token
      const token = req.cookies.token;
      const decoded = jwt.verify(token, secretKey);
      const userId = decoded.userId;

      // Fetch user profile from the database
      const userc = await user.findById(userId);

      if (userc.numéro_national) {
        const candidates = await user.findCandidatesByMahram(
          userc.numéro_national
        );

        const modifiedCandidates = candidates.map((candidate) => ({
          fullName: candidate.firstName_ar + " " + candidate.lastName_ar,
          nationalNum: candidate.numéro_national,
          relationship: candidate.relation_with_mahram,
        }));

        res.status(200).json(modifiedCandidates);
      } else {
        res.status(200).json({ message: "User does not have a mahram ID set" });
      }
    } catch (error) {
      console.error("Error fetching candidates for mahram:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getStatus: async (req, res) => {
    try {
      const token = req.cookies.token;
      const decoded = jwt.verify(token, secretKey);
      const userId = decoded.userId;

      const userc = await user.findById(userId);

      const dossier = userc.dossier_valide;

      if (dossier) {
        const today = new Date();
        const dueDate = new Date(today).setDate(today.getDate + 1);
        const year = today.getFullYear();
        const hadj_info = await hadjInfo.getHadjInfo(year);
        const dateTirage = new Date(
          `${hadj_info[0].la_date_de_tirage}` +
            "T" +
            `${hadj_info[0].heure_de_tirage}`
        );
        console.log(dateTirage);
        if (dateTirage < today) {
          const selectedCandidate = await selected_candidat.findById(userId);

          if (selectedCandidate) {
            res.status(200).json({
              dossier: true,
              koraa: true,
              doctor: selectedCandidate.doctor,
              payment: selectedCandidate.payment,
              vol: selectedCandidate.flight,
              hotel: selectedCandidate.hotel,
            });
          } else {
            if (dateTirage < dueDate) {
              res.status(200).json({
                dossier: true,
                koraa: false,
                doctor: null,
                payment: null,
                vol: null,
                hotel: null,
              });
            } else {
              res.status(200).json({
                dossier: true,
                koraa: null,
                doctor: null,
                payment: null,
                vol: null,
                hotel: null,
              });
            }
          }
        } else {
          res.status(200).json({
            dossier: true,
            koraa: null,
            doctor: null,
            payment: null,
            vol: null,
            hotel: null,
          });
        }
      } else {
        res.status(200).json({
          dossier: dossier,
          koraa: null,
          doctor: null,
          payment: null,
          vol: null,
          hotel: null,
        });
      }
    } catch (error) {
      console.error("Error fetching candidate info:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = profile_controller;
