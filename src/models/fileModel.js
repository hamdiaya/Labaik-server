const supabase = require('../config/database');
const jwt = require('jsonwebtoken');


// Define or import the secretKey
const secretKey='aaichraqisthebestjaaeyeuenkjdvnkjbnhhjhsdkfbkjnikqsd'; // Example secret key, replace with your actual secret key

// Function to decode JWT token and extract user ID
const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded.userId;
  } catch (error) {
    console.error('Error decoding JWT token:', error.message);
    return null;
  }
};

const fileModel = {
  uploadFile: async (fileName, fileData, token) => {
    try {
      // Decode JWT token to get userId
      const userId = getUserIdFromToken(token);

      // Check if userId is valid
      if (!userId) {
        return { success: false, error: 'Invalid or missing token' };
      }

      // Upload the file to Supabase Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('passport')
        .upload(fileName, fileData);

      if (storageError) {
        console.error('Error uploading file to Supabase Storage:', storageError.message);
        return { success: false, error: storageError.message };
      }

      // Insert a record into the user_documents table
      const { data: documentData, error: documentError } = await supabase
        .from('user_documents')
        .insert([{ user_id: userId, file_name: fileName, storage_data: storageData }]);

      if (documentError) {
        console.error('Error inserting record into user_documents table:', documentError.message);
        // Rollback the uploaded file
        // You may want to add logic to delete the file from storage if the insertion fails
        return { success: false, error: documentError.message };
      }

      console.log('File uploaded and record inserted successfully:', documentData);
      return { success: true, documentData };
    } catch (error) {
      console.error('Error uploading file:', error.message);
      return { success: false, error: error.message };
    }
  },
};

module.exports = fileModel;
