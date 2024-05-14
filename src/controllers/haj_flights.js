const candidats = require("../models/candidat");
const selectedCandidats=require("../models/selected_candidat")
const flight = require('../models/flight')

const haj_flights = {
  getFlights: async (req, res) => {
    try {
        const userId = req.decoded.userId;
        haaj = await candidats.findById(userId)
        
            if (!haaj) {
                res.status(404).json(error);
                console.log('haaj not found');
            } else {
                var wilaya = haaj.wilaya_résidence;
                
                if(wilaya.length==1){
                  wilaya='0'+wilaya;
                }
                
                const airoports = await flight.getAirport(wilaya)
                const matchingVols = [];

                for (const airport of airoports) {
                   
                  const volsForAirport = await flight.getByAirportDepart(airport);
                  
                  matchingVols.push(...volsForAirport);
                  
                }
                console.log(matchingVols);
                res.status(200).json(matchingVols);
    }}
    catch (error) {
        
      res.status(404).json(error);
      }
},

reserveFlight: async (req, res) => {
    try {
        const userId = req.decoded.userId;
        haaj = await selectedCandidats.findById(userId);

        const volId = req.body['volId'];

if (haaj == null){
    return res.status(200).json({ error: "Missing candidat" });
}
if (haaj?.flight) {
    return res.status(200).json({ error: "Haj has already reserved a flight" });
  }
        if (!volId) {
            return res.status(200).json({ error: "Missing volId" });
          }

        const vol = await flight.getVolById(volId);
      if (!vol) {
        return res.status(404).json({ error: "Vol not found" });
      }

    if (vol.passengers >= vol.capacity) {
        return res.status(200).json({ error: "Vol is full" });
      }

      vol.passengers++;
     
    await flight.updateVol(vol);

    haaj.vol = volId;
    haaj.flight = true;
    await selectedCandidats.updateVol(haaj);

    return res.status(200).json({ message: "Vol reservation successful" });

    }
    catch (error) {
        
        res.status(404).json(error);
        }
}

}
    module.exports = haj_flights;