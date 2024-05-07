const supabase = require('../config/database');

const Doctor = {
   async findByCommune(commune) {
        try {
            const { data, error } = await supabase
                .from('doctors')
                .select('*')
                .eq('commune', commune)
                .single();
               
                if (!data) {
                     return null;
                
               
            }
            if (error) {
                throw error;
            }

            

            return data;
        } catch (error) {
            console.error('Error finding user by username:', error.message);
            throw error;
        }
    }
}


module.exports = Doctor;
