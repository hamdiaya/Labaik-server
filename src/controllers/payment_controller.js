const supabase = require("../config/database");
const selected_candidat = require("../models/selected_candidat");

  

const payment_controller={
    getCandidatesWithMedicalAccepted:async(req,res)=>{
       try {
        const agentUsername = req.decoded.username; 
       const data=await selected_candidat.getSelectedCandidatesMedicalAccepted(agentUsername);
       if(data=="error"){
        res.status(404).json("error fetching candidats");
       }else{
        res.status(200).json(data);
       }

    if (error) {
        res.status(404).json("error fetching candidats");
    }
       } catch (error) {
        res.status(404).json("error fetching candidats");
       } 
    },
    changePaymentState:async(req,res)=>{
        try {
            const {userId,state}=req.body;
            const data=await selected_candidat.changePaymentState(state,userId);
           
            if(data=="error"){
                res.status(404).json("error changing payment state");
            }
            if(data==null){
                res.status(200).json("state changed");
            }else{
                res.status(404).json("error changing payment state");
            }
        } catch (error) {
            res.status(404).json("error changing payment state");
        }
    }
}
module.exports=payment_controller;