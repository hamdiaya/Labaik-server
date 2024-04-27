const fileModel = require('../models/fileModel');
const { v4: uuidv4 } = require('uuid');

const fileController = {
    uploadFile: async (req, res) => {
        const { documentType } = req.body;
        const file = req.file;
        const token = req.cookies.token; 
        console.log("hhhhhhhhh")
        console.log(documentType)
        console.log(file)
        console.log("hhhhhhhhh")
        try {
           
            const uniqueFileName = `${uuidv4()}_${file.originalname}`;
            const result = await fileModel.uploadFile(uniqueFileName, file.buffer, documentType,token);

            if (result.success) {
                res.status(200).json({ message: 'File uploaded successfully', data: result.data });
            } else {
                res.status(500).json({ error: 'Failed to upload file', message: result.error });
            }
        } catch (error) {
            console.log(error);
            //console.error('Error uploading file:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
};

module.exports = fileController;
