const jwt = require('jsonwebtoken');
const user = require('../models/candidat');
const secretKey='aaichraqisthebestjaaeyeuenkjdvnkjbnhhjhsdkfbkjnikqsd';

const profile_controller={
getProfile:async (req, res) => {
    try {
        // Extract user details from token
        const token = req.cookies.token;
        const decoded = jwt.verify(token,secretKey);
        const userId = decoded.userId;

        // Fetch user profile from the database
        const userc = await user.findById(userId);

        // Extract required profile data
        const {email } = userc;

        // Send profile data in the response
        res.status(200).json({email });
    } catch (error) {
        console.error('Error fetching profile:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}
}

module.exports = profile_controller;
