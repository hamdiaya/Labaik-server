const supabase=require('../config/database');
const nodemailer = require('nodemailer');
const user={

  createCandidat:  async (firstName,lastName,email,password)=> {
    try {
        // Insert user data into the 'users' table
        const { data, error } = await supabase.from('candidats_duplicate').insert([{firstName_ar: firstName,lastName_ar:lastName, email: email,password:password,current:true,userVerified:false}]);

        if (error) {
            return error;
        }

        return data;
    } catch (error) {
        console.error('Error creating user:', error);
        return error;
    }
     },
   
    findUserByemail:async (email)=> {
        try {
            // Query the "candidats" table to find the user by email
            const { data, error } = await supabase
                .from('candidats_duplicate')
                .select('*')
                .eq('email', email)
                .single(); // Assuming the email is unique
    
            if (error) {
                throw error;
            }
    
            if (!data) {
                console.log('User not found');
                return null; // User not found
            }
  
            return data; // Return the user data
        } catch (error) {
            console.error('Error finding user by email:', error.message);
            return error;
        }
    },
 // Assuming findUserByemail is defined in candidat module

 sendConfirmationCodeByEmail : async (email) => {
  try {
    // Generate confirmation code
    const confirmationCode = Math.floor(100000 + Math.random() * 900000);

    // Check if the user exists
    const userData = await user.findUserByemail(email);
    if (!userData) {
      console.error('User not found');
      return false;
    }

    // Update user record with the confirmation code
    // Assuming your supabase instance is imported properly
    const { data: updatedUserData, error: userError } = await supabase
      .from('candidats_duplicate')
      .update({ confirmationCode: confirmationCode })
      .eq('email', email);

    if (userError) {
      console.error('Error updating user with confirmation code:', userError.message);
      return false;
    }

    // Send email with confirmation code
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ayahamdi404@gmail.com',
        pass: 'yhyi ezde iheh wzop'
      }
    });

    const mailOptions = {
      from: 'labaik website',
      to: email,
      subject: 'labaik confirmation code',
      text: `Your confirmation code is: ${confirmationCode}`
    };

    await transporter.sendMail(mailOptions);
    return true; // Confirmation code sent successfully
  } catch (error) {
    console.error('Error sending confirmation code email:', error.message);
    return false;
  }
},




  
    
    verifyConfirmationCode: async (email, confirmationCode) => {
      try {
        const userData = await user.findUserByemail(email);
        if (!userData || !userData.confirmationCode) {
          return false;
        }
       
        if (confirmationCode === userData.confirmationCode) {
          const { data, error } = await supabase
            .from('candidats_duplicate')
            .update({ userVerified: true })
            .eq('email', email);
          if (error) {
            console.error('Error updating user verification status:', error.message);
            return false;
          }
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error('Error verifying confirmation code:', error.message);
        return false;
      }
    }
    
    








    
}

  module.exports=user;