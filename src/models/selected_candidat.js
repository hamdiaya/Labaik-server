const supabase = require('../config/database');

const selected_candidat = {
 addSelectedCnadidat:async (id,commune)=> {
    try {
        // Query the "candidats" table to find the user by username
        const { data, error } = await supabase
            .from('selected_candidats')
            .insert({id:id,commune:commune})
            
             // Assuming the username is unique

        if (error) {
           
            return 'error';
        }
console.log(data);

        return data; // Return the user data
    } catch (error) {
        return 'error';
    }
},

getSelectedById:async (selectedId)=> {
    try {
        const { data, error } = await supabase
          .from('selected_candidats')
          .select('*')
          .eq('id', selectedId)
          .single();
    
            
          if (!data) {
            return null;}
       
        if (error) {
          return error;
        }
        return data;

    } catch{
        console.error('Error fetching user by ID:', error);
        return error;
    }


}
};

module.exports = selected_candidat;
