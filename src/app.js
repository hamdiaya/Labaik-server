require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authCandidat = require('./routes/auth_candidat');
const authAdmin = require('./routes/auth_admin');
const registration = require('./routes/registration');
const profile = require('./routes/profile');

const app = express();

// Use CORS middleware
const allowedOrigins = ['http://localhost:3001']; // Adjust this to your frontend origin
const corsOptions = {
  origin: allowedOrigins,
  credentials: true // Allow credentials (cookies) to be sent
};
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use('/authAdmin', authAdmin);
app.use('/profile', profile);
app.use('/authCnadidat', authCandidat);
app.use('/registration', registration);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
