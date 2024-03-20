const candidat = require('../models/candidat');
const bcrypt=require('bcrypt');

const auth_controller={

    signUp:async(req, res) =>{
        const { firstName,lastName,email,password} = req.body;
        try {
          const hashedPassword=await bcrypt.hash(password,10);
          const user = await candidat.createCandidat(firstName,lastName,email,hashedPassword);
          if(user!=null){
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
        
}


module.exports=auth_controller;