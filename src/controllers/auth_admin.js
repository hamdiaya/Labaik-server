const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const admin = require('../models/admin');

const cookieOptions = {
    httpOnly: true,
    maxAge: 3000*30*24*60*60, // month in milliseconds
    secure: true, // Set to true in production if using HTTPS
    sameSite: 'None', 
  };

const secretKey='aaichraqisthebestjaaeyeuenkjdvnkjbnhhjhsdkfbkjnikqsd';

const adminController = {
  login: async (req, res) => {
    const { username, password } = req.body;

    try {

      const adminData = await admin.findByUsername(username);

      if (adminData = null) {
        console.log('Admin not found');
        return res.status(404).json({ error: 'Admin not found' });
      }

      // Compare the provided password with the hashed password
      const passwordMatch = await bcrypt.compare(password, adminData.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Incorrect password' });
      }

      // Generate JWT token with admin ID and email
      const token = jwt.sign({ adminId: adminData.id, username: adminData.username }, secretKey, {});
      res.cookie('token', token,cookieOptions);

      res.status(200).json({ token });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = adminController;
