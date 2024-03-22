const user = require('../models/candidat');
const candidat = require('../models/candidat');
const bcrypt=require('bcrypt');
const moment = require('moment');
const jwt=require('jsonwebtoken');
const secretKey='aaichraqisthebestjaaeyeuenkjdvnkjbnhhjhsdkfbkjnikqsd';
const cookieOptions = {
  httpOnly: true,
  maxAge: 3000*30*24*60*60, // month in milliseconds
  secure: true, // Set to true in production if using HTTPS
  sameSite: 'None', 
};
const auth_controller={

    signUp:async(req, res) =>{
        const { firstName,lastName,email,password} = req.body;
        try {
          const hashedPassword=await bcrypt.hash(password,10);
          const user = await candidat.createCandidat(firstName,lastName,email,hashedPassword);
          console.log(user);
          if(user!=null){
            res.status(404).json('account already exist');
          }else{
            res.status(201).json('account created');
          } 
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      },


      sendConfirmationCode: async (req, res) => {
        const { email } = req.body;
       
          try {
            const data=await candidat.sendConfirmationCodeByEmail(email);
            console.log(data);
            if(data=="confirmation code sent successfully"){
              res.status(200).json({ message: 'Confirmation code sent' });
            }else{
              res.status(400).json({ message:data.toString() });
            }
        
          } catch (error) {
            res.status(400).json({ error: error.message });
          }
        
      },




 verifyConfirmationCode: async (req, res) => {
  const { email, confirmationCode } = req.body;
  try {
    const data = await candidat.verifyConfirmationCode(email, confirmationCode);
    if (data=="user verified") {
      res.status(200).json('user verified successfully');
    } else {
      res.status(400).json({message:data.toString()});
    }
  } catch (error) {
    res.status(500).json('error');
  }
},

setCandidatInfo: async (req, res) => {
  const { email, firstName_fr, lastName_fr, sexe, date_of_birth, numéro_national, father_name_arabe, mother_first_name_arabe, mother_last_name_arabe, wilaya_résidence, commune_résidence,ancienté } = req.body;
  try {
    const formattedDate = moment(date_of_birth, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const result = await candidat.setCandidatInfo(email, firstName_fr, lastName_fr, sexe, formattedDate, numéro_national, father_name_arabe, mother_first_name_arabe, mother_last_name_arabe, wilaya_résidence, commune_résidence,ancienté);
    if (result=="candidate informations added successfully") {
      res.status(200).json({ message: 'Candidat info updated successfully' });
    } else {
      res.status(404).json({ error: result.toString() });
    }
  } catch (error) {
   
    res.status(500).json({ error: 'Internal server error' });
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
      if (!existingUser&&!existingUser.infoSetted) {
          return res.status(403).json({ error: 'User information not set' });
      }

      // Check if the user has uploaded all required documents
      if (!existingUser.documentsUploaded) {
          return res.status(403).json({ error: 'User documents not uploaded' });
      }

       // Generate JWT token with user ID, email
       const token = jwt.sign({ userId: existingUser.id, email: existingUser.email }, secretKey, {});

       // Set cookie with JWT token
       res.cookie('jwt', token,cookieOptions);

      // If everything is okay, return success
      res.status(200).json({ message: 'Login successful', userId: existingUser.id, email: existingUser.email});

  } catch (error) {
      // If an unexpected error occurs, return a 500 error
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
},


  addMahram:async(req,res)=>{
   const {email,numéro_national_mahram}=req.body;
   try {
    const existingUser = await user.findUserByemail(email)

      if (!existingUser||!existingUser.email) {
          // If user doesn't exist, return a 404 error
          return res.status(404).json({ error: 'User not found' });
      }
      if(existingUser.sexe=="ذكر"){
        return res.status(404).json({error:'تم تحديد الجنس: ذكر,هذا الحقل لا يخصك'});
      }else{
        if(existingUser.sexe=="انثى"){
          const data=await candidat.linkToMahram(email,numéro_national_mahram);
          if(data==" Successfully linked to Mahram"){
           return res.status(200).json('mahram added');
          }else{
           return res.status(404).json({message:data.toString()});
          }
        }
      }
   } catch (error) {
    
   }
  }


}


module.exports=auth_controller;