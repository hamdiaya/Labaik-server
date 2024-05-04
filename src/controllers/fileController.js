const fileModel = require("../models/fileModel");
const { v4: uuidv4 } = require("uuid");
const supabase = require("../config/database");
const fileController = {
  uploadFile: async (req, res) => {
    const { documentType } = req.body;
    const file = req.file;
    const token = req.cookies.token;

    console.log(documentType);
    console.log(file);

    try {
      const uniqueFileName = `${uuidv4()}_${file.originalname}`;
      const result = await fileModel.uploadFile(
        uniqueFileName,
        file.buffer,
        documentType,
        token
      );

      if (result.success) {
        res
          .status(200)
          .json({ message: "File uploaded successfully", data: result.data });
      } else {
        res
          .status(500)
          .json({ error: "Failed to upload file", message: result.error });
      }
    } catch (error) {
      console.log(error);
      //console.error('Error uploading file:', error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getDocumentsForUser: async (req, res) => {
    try {
      const userId = req.params.id;
      console.log(userId);
      // Query the database to fetch document metadata for the specified user
      const { data: userDocuments, error } = await supabase
        .from("user_documents")
        .select("file_name,document_type")
        .eq("user_id", userId);

      // Check for errors in fetching documents metadata
      if (error) {
        console.error("Error fetching documents metadata:", error.message);
        return { error: "Internal server error" };
      }

      // Construct URLs for downloading files from Supabase storage
      const data = await Promise.all(
        userDocuments.map(async (document) => {
          const fileName = document.file_name;
          const fileType = document.document_type;

          const url = await supabase.storage
            .from("documents")
            .createSignedUrl(fileName, 66666);

          return {
            file_type: fileType,
            url: url.data.signedUrl,
          };
        })
      );

      res.status(200).json(data);
    } catch (error) {
      // Handle errors
      console.error("Error getting documents for user:", error.message);
      return { error: "Internal server error" };
    }
  },
};

module.exports = fileController;
