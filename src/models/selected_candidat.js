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
        .select('id,numéro_national,first_name,last_name')
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
  }
};

module.exports = selected_candidat;
