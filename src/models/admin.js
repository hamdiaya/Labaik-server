const supabase = require('../config/database');

const admin = {
  findByUsername: async (usernameA) => {
    try {
      console.log('Finding admin by username:', usernameA);
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('username', usernameA)
        .single();
  
      if (error) {
        console.error('Error fetching admin by username:', error.message);
        throw error;
      }

      console.log('Admin data:', data);
  
      return data;
    } catch (error) {
      console.error('Error fetching admin by username:', error.message);
      throw error;
    }
  }
};

module.exports = admin;
