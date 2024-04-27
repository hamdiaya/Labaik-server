const supabase = require('../config/database');
const jwt = require('jsonwebtoken');
const secretKey='aaichraqisthebestjaaeyeuenkjdvnkjbnhhjhsdkfbkjnikqsd'; 

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
    uploadFile: async (fileName, fileData, documentType,token) => {
      
        try {
            const userId = getUserIdFromToken(token);
            if (!userId) {
                return { success: false, error: 'Invalid or missing token' };
            }

            const { data: storageData, error: storageError } = await supabase.storage
                .from('documents')
                .upload(fileName, fileData);

            if (storageError) {
                console.error('Error uploading file to Supabase Storage:', storageError.message);
                return { success: false, error: storageError.message };
            }

            const { data: documentData, error: documentError } = await supabase
            .from('user_documents')
            .insert([{ user_id: userId, document_type: documentType, file_name: fileName, file_data: storageData }]);
        

            if (documentError) {
                console.error('Error inserting record into user_documents table:', documentError.message);
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
