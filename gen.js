const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://czokumpheorpxoxguygy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6b2t1bXBoZW9ycHhveGd1eWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA4MDI0NDAsImV4cCI6MjAyNjM3ODQ0MH0.6GWyRYb8Ndmt-AZdZRObsq9hqpiGFMma5ByCUYgo4aM';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to generate random passwords
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Function to create accounts with commune names as usernames
async function createAccountsFromCommunes() {
    // Retrieve commune names from 'commune' table
    const { data: communes, error } = await supabase.from('communes').select('commune_name');
    if (error) {
        console.error('Error retrieving commune names:', error.message);
        return;
    }

    // Iterate over commune names and create accounts
    for (let i = 0; i < communes.length; i++) {
        const communeName = communes[i].commune_name;
        const password = generateRandomString(10); // Change the length as needed

        // Insert account into Supabase table
        const { data, insertError } = await supabase.from('agents').insert([{ username: communeName, password }]);
        if (insertError) {
            console.error('Error adding account:', insertError.message);
        } else {
            console.log('Account added:', data);
        }
    }
}

// Usage
createAccountsFromCommunes();
