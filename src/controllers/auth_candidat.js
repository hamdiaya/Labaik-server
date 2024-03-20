const user = require('../models/candidat');
const candidat = require('../models/candidat');
const bcrypt=require('bcrypt');

const auth_controller={

    signUp:async(req, res) =>{
        const { firstName,lastName,email,password} = req.body;
        try {
          const hashedPassword=await bcrypt.hash(password,10);
          const user = await candidat.createCandidat(firstName,lastName,email,hashedPassword);
          if(user!=null){
            console.log(user);
            res.status(404).json('account already exist');
          }
          res.status(201).json('account created');
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      },


      sendConfirmationCode: async (req, res) => {
        const { email } = req.body;
       
          try {
            if(await candidat.sendConfirmationCodeByEmail(email)){
              res.status(200).json({ message: 'Confirmation code sent' });
            }else{
              res.status(400).json({ message:'email not found' });
            }
        
          } catch (error) {
            res.status(400).json({ error: error.message });
          }
        
      },


     verifyConfirmationCode: async (req, res) => {
  const { email, confirmationCode } = req.body;
  try {
    const verified = await candidat.verifyConfirmationCode(email, confirmationCode);
    if (verified) {
      res.status(200).json('verified');
    } else {
      res.status(400).json('not verified');
    }
  } catch (error) {
    res.status(500).json('error');
  }
},

login: async (req, res) => {
  const { email, password } = req.body;

  try {
      // Check if the user with the given email exists
      const existingUser = await user.findUserByemail(email)

      if (!existingUser||!existingUser.email) {
          // If user doesn't exist, return a 404 error
          return res.status(404).json({ error: 'User not found' });
      }
      console.log(existingUser.password);
      const passwordMatch = await bcrypt.compare(password, existingUser.password);

      if (!passwordMatch) {
          // If passwords don't match, return a 401 error
          return res.status(401).json({ error: 'Incorrect password' });
      }
      // Check if the user is verified
      if (!existingUser.userVerified) {
          return res.status(403).json({ error: 'User not verified' });
      }

      // Check if the user has set all required information
      if (!existingUser.infoSetted) {
          return res.status(403).json({ error: 'User information not set' });
      }

      // Check if the user has uploaded all required documents
      if (!existingUser.documentsUploaded) {
          return res.status(403).json({ error: 'User documents not uploaded' });
      }

      // Compare the provided password with the hashed password
      

      // If everything is okay, return success
      res.status(200).json({ message: 'Login successful' });

  } catch (error) {
      // If an unexpected error occurs, return a 500 error
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
}


}


module.exports=auth_controller;