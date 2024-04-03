const supabase = require('../config/database');

const Agent = {
   async findByUsername(username) {
        try {
            const { data, error } = await supabase
                .from('agents')
                .select('*')
                .eq('username', username)
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


module.exports = Agent;
