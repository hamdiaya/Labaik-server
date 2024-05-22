const supabase = require("../config/database");
const user = require("./candidat");

const selected_candidat = {
 
  addSelectedCnadidat: async (
    id,
    commune,
    numéro_national,
    wilaya,
    firstName_ar,
    lastName_ar
  ) => {
    try {
      // Query the "candidats" table to find the user by username
      const { data, error } = await supabase
        .from("selected_candidats")
        .insert({
          id: id,
          commune: commune,
          numéro_national: numéro_national,
          wilaya: wilaya,
          first_name: firstName_ar,
          last_name: lastName_ar,
        });

      // Assuming the username is unique

      if (error) {
        console.log(error);
        return "error";
      }
      console.log(data);

      return data; // Return the user data
    } catch (error) {
      return "error";
    }
  },
  addPendingCnadidat: async (
    id,
    commune,
    numéro_national,
    wilaya,
    firstName_ar,
    lastName_ar
  ) => {
    try {
    

     
      // Query the "candidats" table to find the user by username
      const { data, error } = await supabase
        .from("en_attente")
        .insert({
          id: id,
          commune: commune,
          numéro_national: numéro_national,
          wilaya: wilaya,
          first_name: firstName_ar,
          last_name: lastName_ar,
        });

     
  
      if (error) {
        console.log(error);
        return "error";
      }


      return data; // Return the user data
    
    } catch (error) {
        return 'error';
    }
  },

  searchSelectedCandidat: async (numéro_national) => {
    try {
      const { data, error } = await supabase
        .from("selected_candidats")
        .select("*")
        .eq("numéro_national", numéro_national);
      if (!data || !data.numéro_national) {
        return "user not found";
      } else {
        return data;
      }
    } catch (error) {
      return "error";
    }
  },
  searchPendingCandidat: async (numéro_national) => {
    try {
      const { data, error } = await supabase
        .from("en_attente")
        .select("*")
        .eq("numéro_national", numéro_national);
      if (!data || !data.numéro_national) {
        return "user not found";
      } else {
        return data;
      }
    } catch (error) {
      return "error";
    }
  },
  getAllSelectedCandidates: async () => {
    try {
      const { data, error } = await supabase
        .from("selected_candidats")
        .select("*");

      if (error) {
        console.log(error);
        return "error";
      } else {
        if (data != null) {
          return data;
        } else {
          return null;
        }
      }
    } catch (error) {
      console.log(error);
      return "error";
    }
  },
  getSelectedCandidatesMedicalAccepted: async (agentUsername) => {
    try {
        const { data, error } = await supabase
        .from('selected_candidats')
        .select('id,numéro_national,first_name,last_name,payment')
        .eq('commune', agentUsername)
        .eq('doctor', true);

      if (error) {
        console.log(error);
        return "error";
      } else {
        if (data != null) {
          return data;
        } else {
          return null;
        }
      }
    } catch (error) {
      console.log(error);
      return "error";
    }
  },
  changePaymentState:async(state,userId)=>{
    try {
        const { data, error } = await supabase
        .from("selected_candidats")
        .update({payment: state })
        .eq('id',userId);

      if (error) {
        console.log(error);
        return "error";
      } else {
        if (data != null) {
          return data;
        } else {
          return null;
        }
      } 
    } catch (error) {
        
    }
  },
  

  findById: async (userId) => {
    try {
      const { data, error } = await supabase
        .from("selected_candidats")
        .select("*")
        .eq("id", userId)
        .single();

      if (!data) {
        return null;
      }

      if (error) {
        return error;
      }

      return data;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return error;
    }
  },
  updateVol: async (candidat) => {
    try {
      const { data, error } = await supabase
        .from("selected_candidats")
        .update({
          vol: candidat.vol,
          flight: true,
        })
        .eq("id", candidat.id);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error updating candidat:", error);
      throw error;
    }
  },

  updateHotel: async (candidat) => {
    try {
      const { data, error } = await supabase
        .from("selected_candidats")
        .update({
          hotel_room: candidat.hotel_room,
          hotel: true,
        })
        .eq("id", candidat.id);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error updating candidat:", error);
      throw error;
    }
  },
  getTotalNumberOfAcceptedCandidat: async () => {
    try {
     
      const { data, error, count } = await supabase
        .from("selected_candidats")
        .select("*", { count: "exact" }); // Use the count option to get the total number of users

      if (error) {
        return "error";
      }
   
      return count;
    } catch (error) {
      return "error";
    }
  },
  getTotalNumberOfAcceptedCandidatOfWilaya: async (wilaya) => {
    try {
     
      const { data, error, count } = await supabase
        .from("selected_candidats")
        .select("*", { count: "exact" })
        .eq('wilaya',wilaya); // Use the count option to get the total number of users

      if (error) {
        return "error";
      }
   
      return count;
    } catch (error) {
      return "error";
    }
  },
  getTotalNumberOfAcceptedCandidatAfterMedicalVisite: async () => {
    try {
     
      const { data, error, count } = await supabase
        .from("selected_candidats")
        .select("*", { count: "exact" })
        .eq("doctor",true); // Use the count option to get the total number of users

      if (error) {
        return "error";
      }
   
      return count;
    } catch (error) {
      return "error";
    }
  },
  getTotalNumberOfAcceptedCandidatAfterMedicalVisiteOfWilaya: async (wilaya) => {
    try {
     
      const { data, error, count } = await supabase
        .from("selected_candidats")
        .select("*", { count: "exact" })
        .eq("doctor",true)
        .eq('wilaya',wilaya); // Use the count option to get the total number of users

      if (error) {
        return "error";
      }
   
      return count;
    } catch (error) {
      return "error";
    }
  },
  getTotalNumberOfAcceptedCandidatPayé: async () => {
    try {
     
      const { data, error, count } = await supabase
        .from("selected_candidats")
        .select("*", { count: "exact" })
        .eq("payment",true); // Use the count option to get the total number of users

      if (error) {
        return "error";
      }
   
      return count;
    } catch (error) {
      return "error";
    }
  },
  getTotalNumberOfAcceptedCandidatPayéOfWilaya: async (wilaya) => {
    try {
     
      const { data, error, count } = await supabase
        .from("selected_candidats")
        .select("*", { count: "exact" })
        .eq("payment",true)
        .eq('wilaya',wilaya); // Use the count option to get the total number of users

      if (error) {
        console.log(error)
        return "error";
      }
   
      return count;
    } catch (error) {
      return "error";
    }
  },
};

module.exports = selected_candidat;
