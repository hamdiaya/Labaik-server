const supabase = require("../config/database");
const nodemailer = require("nodemailer");
const user = {
  createCandidat: async (firstName, lastName, email, password) => {
    try {
      // Insert user data into the 'users' table
      const { data, error } = await supabase
        .from("candidats_duplicate")
        .insert([
          {
            firstName_ar: firstName,
            lastName_ar: lastName,
            email: email,
            password: password,
            current: true,
            userVerified: false,
          },
        ]);

      if (error) {
        return error;
      }
      return data;
    } catch (error) {
      console.error("Error creating user:", error);
      return error;
    }
  },

  findUserByemail: async (email) => {
    try {
      // Query the "candidats" table to find the user by email
      const { data, error } = await supabase
        .from("candidats_duplicate")
        .select("*")
        .eq("email", email)
        .single(); // Assuming the email is unique

      if (error) {
        return error;
      }

      if (!data || !data.email) {
        console.log("User not found");
        return "User not found"; // User not found
      }

      return data; // Return the user data
    } catch (error) {
      return error;
    }
  },
  // Assuming findUserByemail is defined in candidat module

  sendConfirmationCodeByEmail: async (email) => {
    try {
      // Generate confirmation code
      const confirmationCode = Math.floor(100000 + Math.random() * 900000);

      // Check if the user exists
      const userData = await user.findUserByemail(email);
      //console.log(userData);
      if (!userData || !userData.email) {
        return "user not found";
      }

      // Update user record with the confirmation code
      // Assuming your supabase instance is imported properly
      const { data: updatedUserData, error: userError } = await supabase
        .from("candidats_duplicate")
        .update({ confirmationCode: confirmationCode })
        .eq("email", email);

      if (userError) {
        console.error(
          "Error updating user with confirmation code:",
          userError.message
        );
        return "Error updating user with confirmation code";
      }

      // Send email with confirmation code
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "ayahamdi404@gmail.com",
          pass: "yhyi ezde iheh wzop",
        },
      });

      const mailOptions = {
        from: "labaik website",
        to: email,
        subject: "labaik confirmation code",
        text: `Your confirmation code is: ${confirmationCode}`,
      };

      await transporter.sendMail(mailOptions);
      return "confirmation code sent successfully"; // Confirmation code sent successfully
    } catch (error) {
      return "Error sending confirmation code email:";
    }
  },

  verifyConfirmationCode: async (email, confirmationCode) => {
    try {
      const userData = await user.findUserByemail(email);
      if (!userData || !userData.confirmationCode) {
        return "user not found";
      }

      if (confirmationCode === userData.confirmationCode) {
        const { data, error } = await supabase
          .from("candidats_duplicate")
          .update({ userVerified: true })
          .eq("email", email);

        if (error) {
          return "Error updating user verification status:";
        }
        return "user verified";
      } else {
        return "confirmation code is wrong";
      }
    } catch (error) {
      return "Error verifying confirmation code:";
    }
  },
  setCandidatInfo: async (
    email,
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
    ancienté
  ) => {
    try {
      // Check if the user exists
      const data = await user.findUserByemail(email);
      if (!data || !data.email) {
        return "User not found";
      }

      if (
        data.numéro_national != null &&
        data.numéro_national != numéro_national
      ) {
        return "vous ne pouves pas changer le numéro nationale";
      }
      const userData = await user.findUserByNuméroNationale(numéro_national);
      if (
        !userData ||
        !userData.email ||
        (userData != null && userData.email == email)
      ) {
        const { data, error } = await supabase

          .from("candidats_duplicate")
          .update({
            firstName_fr: firstName_fr,
            lastName_fr: lastName_fr,
            sexe: sexe,
            date_of_birth: date_of_birth,
            numéro_national: numéro_national,
            father_name_arabe: father_name_arabe,
            mother_first_name_arabe: mother_first_name_arabe,
            mother_last_name_arabe: mother_last_name_arabe,
            wilaya_résidence: wilaya_résidence,
            commune_résidence: commune_résidence,
            infoSetted: true,
            ancienté: ancienté,
          })
          .eq("email", email);

        if (error) {
          console.log(error);
          return "Error updating candidat info";
        }

        return "candidate informations added successfully";
      } else {
        return "numéro nationale deja utilisée";
      }
      // Update the row with the provided values
      // Candidat info updated successfully
    } catch (error) {
      console.log(error);
      return "Error updating candidat info:";
    }
  },

  findById: async (userId) => {
    try {
      // Query the database to find the user by ID
      const { data, error } = await supabase
        .from("candidats_duplicate")
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
  linkToMahram: async (
    email,
    numéro_nationale_mahram,
    relation_with_mahram
  ) => {
    try {
      console.log("hehe");
      // Search for user with numéro_national equal to numéro_nationale_mahram
      const mahramUser = await user.findUserByNuméroNationale(
        numéro_nationale_mahram
      );
      console.log(mahramUser);
      if (!mahramUser || !mahramUser.email) {
        return "Mahram user not found , the mahram must register";
      }
      if (mahramUser.sexe == "انثى") {
        return "Mahram must be a male";
      }

      // Update the row with the specified email to set numéro_mahram
      const { data, error } = await supabase
        .from("candidats_duplicate")
        .update({
          numéro_nationale_mahram: numéro_nationale_mahram,
          current: true,
          relation_with_mahram: relation_with_mahram,
        })
        .eq("email", email);

      if (error) {
        return "Error linking to Mahram:";
      }

      return " Successfully linked to Mahram"; // Successfully linked to Mahram
    } catch (error) {
      return "Error linking to Mahram:";
    }
  },

  findUserByNuméroNationale: async (numéro_nationale) => {
    try {
      // Query the "candidats" table to find the user by email
      const { data, error } = await supabase
        .from("candidats_duplicate")
        .select("*")
        .eq("numéro_national", numéro_nationale)
        .single(); // Assuming the email is unique

      if (error) {
        return error;
      }

      if (!data || !data.email) {
        console.log("User not found");
        return "user not found"; // User not found
      }

      return data; // Return the user data
    } catch (error) {
      console.error(
        "Error finding user by numéro_nationale_mahram:",
        error.message
      );
      return "Error finding user by numéro";
    }
  },

  reserPassword: async (newPassword, email) => {
    try {
      const userData = await user.findUserByemail(email);

      if (!userData || !userData.email) {
        return "user not found";
      }

      const { data, error } = await supabase
        .from("candidats_duplicate")
        .update({ password: newPassword })
        .eq("email", email);

      if (error) {
        return "Error changing password";
      }

      return "password changed";
    } catch (error) {
      console.log(error);
    }
  },
  sendResetPasswordTokenByEmail: async (email) => {
    try {
      // Generate confirmation code
      const reset_token = Math.floor(100000 + Math.random() * 900000);

      // Check if the user exists
      const userData = await user.findUserByemail(email);
      //console.log(userData);
      if (!userData || !userData.email) {
        return "user not found";
      }

      // Update user record with the confirmation code
      // Assuming your supabase instance is imported properly
      const { data: updatedUserData, error: userError } = await supabase
        .from("candidats_duplicate")
        .update({ reset_token: reset_token })
        .eq("email", email);

      if (userError) {
        console.error(
          "Error updating user with reset_token:",
          userError.message
        );
        return "Error updating user with reset_token:";
      }

      // Send email with confirmation code
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "ayahamdi404@gmail.com",
          pass: "yhyi ezde iheh wzop",
        },
      });

      const mailOptions = {
        from: "labaik website",
        to: email,
        subject: "labaik confirmation code",
        text: `Your reset token is: ${reset_token}`,
      };

      await transporter.sendMail(mailOptions);
      return "reset token sent successfully"; // Confirmation code sent successfully
    } catch (error) {
      return "Error sendingreset token email:";
    }
  },
  verifyResetToken: async (email, reset_token) => {
    try {
      const userData = await user.findUserByemail(email);
      if (!userData || !userData.email) {
        return "user not found";
      }

      if (reset_token === userData.reset_token) {
        return "reset token correct";
      } else {
        return "reset token is wrong";
      }
    } catch (error) {
      return "Error verifyingreset token";
    }
  },
  updateCandidateDossierVerification: async (candidateId, status) => {
    try {
      const { data, error } = await supabase
        .from("candidats_duplicate")
        .update({ dossier_valide: status })
        .eq("id", candidateId);

      if (error) {
        throw error;
      }

      console.log("Candidate verification status updated successfully");
    } catch (error) {
      console.error(
        "Error updating candidate verification status:",
        error.message
      );
      throw error;
    }
  },

  findCandidatesByMahram: async (numéro_national) => {
    try {
      // Query the database to find candidates with the given mahram ID
      const { data, error } = await supabase
        .from("candidats_duplicate")
        .select("*")
        .eq("numéro_nationale_mahram", numéro_national);

      if (error) {
        return error;
      }

      return data;
    } catch (error) {
      console.error("Error fetching candidates by Mahram ID:", error);
      return error;
    }
  },
  getTotalNumberOfCandidat: async () => {
    try {
      const { data, error, count } = await supabase
        .from("candidats_duplicate")
        .select("*", { count: "exact" }); // Use the count option to get the total number of users

      if (error) {
        return "error";
      }
      return count;
    } catch (error) {
      return "error";
    }
  },
  getNumberOfCandidatOfWilaya:async(wilaya)=>{
    try {
      const { data, error, count } = await supabase
        .from("candidats_duplicate")
        .select("*", { count: "exact" })
        .eq('wilaya_résidence',wilaya); // Use the count option to get the total number of users

      if (error) {
        return "error";
      }
      
      return count;
    } catch (error) {
      return "error";
    }
  }
};

module.exports = user;
