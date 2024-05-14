const supabase=require('../config/database');

const flight = {
    getAirport: async (wilayaCode) => {
        try {
           
            const { data, error } = await supabase
                .from('wilayas')
                .select('airoports')
                .eq('wilaya_code', wilayaCode)
                
               

            if (error) {
                console.log(error)
                throw new Error('Error fetching wilaya');
            }

            if (!data) {
                return { error: 'Wilaya not found' };
            }

            return data[0].airoports;
        } catch (error) {
            throw error;
        }
    },

    getByAirportDepart:async(airport)=> {
        try { 
            
          const { data, error } = await supabase
            .from('vols')
            .select('*')
            .eq('airport_depart', airport);
            
      
          if (error) {
            throw error;
          }
      
          return data;
        } catch (error) {
          console.error('Error fetching vols by airport depart:', error);
          throw error;
        }
      },

      getVolById:async(volId)=> {
        try {
          const { data, error } = await supabase
            .from('vols')
            .select('*')
            .eq('id', volId);
      
          if (error) {
            throw error;
          }
      
          return data[0] || null; // Return the first element (vol) or null if not found
        } catch (error) {
          console.error('Error fetching vol by ID:', error);
          throw error;
        }
      },
    updateVol:async(vol)=> {
        try {
          const { data, error } = await supabase
            .from('vols')
            .update({ passengers: vol.passengers })
            .eq('id', vol.id);
      
          if (error) {
            throw error;
          }
          return data; 
        } catch (error) {
          console.error('Error updating vol:', error);
          throw error;
        }
      }
      

};

module.exports = flight;
