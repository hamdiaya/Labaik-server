const fileModel = require('../models/fileModel');


const fileController = {
  uploadFile: async (req, res) => {
    const file = req.file;
    const token = req.token;

    try {
      const result = await fileModel.uploadFile(file.originalname, file.buffer,token);

      if (result.success) {
        res.status(200).json({ message: 'File uploaded successfully', data: result.data });
      } else {
        res.status(500).json({ error: 'Failed to upload file', message: result.error });
      }
    } catch (error) {
      console.error('Error uploading file:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = fileController;