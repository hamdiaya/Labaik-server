const jwt = require('jsonwebtoken');
const Doctor = require('../models/doctor');

const cookieOptions = {
    httpOnly: true,
    maxAge: 3000*30*24*60*60, 
    secure: true, // Set to true in production if using HTTPS
    sameSite: 'None', 
  };

const secretKey='aaichraqisthebestjaaeyeuenkjdvnkjbnhhjhsdkfbkjnikqsd';


const DocController = {
    login: async (req, res) => {
        const { commune, password } = req.body;

        try {
            // Check if the agent with the given username exists
            const existingDoctor = await Doctor.findByCommune(commune);

            if (!existingDoctor || !existingDoctor.commune ) {
                // If agent doesn't exist, return a 404 error
                return res.status(404).json({ error: 'User not found' });
            }


            

            if (existingDoctor.password !== password) {
                // If passwords don't match, return a 401 error
                return res.status(401).json({ error: 'Incorrect password' });
            }

            // Generate JWT token with agent ID and username
            const token = jwt.sign({ docId: existingDoctor.id, commune: existingDoctor.commune }, secretKey, {});

            // Set cookie with JWT token
            res.cookie('Doctoken', token, cookieOptions);

            // If everything is okay, return success
            res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            // If an unexpected error occurs, return a 500 error
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    logout: async (req, res) => {
        try {
            // Clear cookie with JWT token
            res.clearCookie('Doctoken');
            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
};

module.exports = DocController;
