const supabase=require('../config/database');

const user={
  createCandidat:  async (firstName,lastName,phoneNumber,password)=> {
    try {
        // Generate verification code (6-digit random number)
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        // Insert user data into the 'users' table
        const { data, error } = await supabase.from('candidats_duplicate').insert([{firstName: firstName,lastName:lastName, phoneNumber: phoneNumber, confirmationCode: verificationCode,password:password,current:true,userVerified:false}]);

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
      },
   
  
}

  module.exports=user;