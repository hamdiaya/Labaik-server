const candidat = require('../models/candidat');
const moment = require('moment');
const registration_controller={

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

      addMahram:async(req,res)=>{
        const {email,numéro_national_mahram}=req.body;
        try {
         const existingUser = await candidat.findUserByemail(email)
     
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
module.exports=registration_controller;