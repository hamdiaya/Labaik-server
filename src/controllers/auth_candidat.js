
const candidat = require('../models/candidat');
const bcrypt=require('bcrypt');
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
         
          if(user!=null){
            res.status(404).json('account already exist');
          }else{
            const existingUser = await candidat.findUserByemail(email)

      if (!existingUser||!existingUser.email) {
          // If user doesn't exist, return a 404 error
          return res.status(404).json({ error: 'User not found' });
      }
     
            const token = jwt.sign({ userId: existingUser.id, email: existingUser.email }, secretKey, {});

            // Set cookie with JWT token
            res.cookie('token', token,cookieOptions);
            res.status(201).json('account created');
          } 
        } catch (error) {
          res.status(400).json({ error: error.message });
        } 
      },


      sendConfirmationCode: async (req, res) => {
        const token = req.cookies.token;
        const decoded = jwt.verify(token,secretKey);
        const userId = decoded.userId;

        // Fetch user profile from the database
        const userc = await candidat.findById(userId);
       
        if(!userc||!userc.email){
      
          res.status(400).json('user not found');
        }

        const email  = userc.email;
       console.log(email)
          try {
            const data=await candidat.sendConfirmationCodeByEmail(email);
            //console.log(data);
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
  const token = req.cookies.token;
        const decoded = jwt.verify(token,secretKey);
        const userId = decoded.userId;

        // Fetch user profile from the database
        const userc = await candidat.findById(userId);
        if(!userc||!userc.email){
          res.status(400).json('user not found');
        }

        const email = userc.email;
        const  {confirmationCode } = req.body;
        console.log(email)
        console.log(confirmationCode)
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




login: async (req, res) => {
  const { email, password } = req.body;

  try {
      // Check if the user with the given email exists
      const existingUser = await candidat.findUserByemail(email)

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
       res.cookie('token', token,cookieOptions);

      // If everything is okay, return success
      res.status(200).json({ message: 'Login successful', userId: existingUser.id, email: existingUser.email});

  } catch (error) {
      // If an unexpected error occurs, return a 500 error
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
},

logout:async (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

}


module.exports=auth_controller;