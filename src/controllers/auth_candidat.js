const candidat = require('../models/candidat');


const auth_controller={

    signUp:async(req, res) =>{
        const { firstName,lastName,phoneNumber,password} = req.body;
        try {
          const user = await candidat.createCandidat(firstName,lastName,phoneNumber,password);
          res.status(201).json(user);
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      }
}


module.exports=auth_controller;