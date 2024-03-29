const jwt = require('jsonwebtoken');
const secretKey = 'aaichraqisthebestjaaeyeuenkjdvnkjbnhhjhsdkfbkjnikqsd'; // Replace with your actual secret key

const verifyToken = (req, res, next) => {
  const token = req.headers.cookie
    .split('; ') // Split header by semicolons and spaces
    .find((row) => row.startsWith('Admintoken=')) // Find row starting with 'token='
    ?.split('=')[1]; // Extract value after the '=' sign (if found)

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Wrap verification in a promise-based function
  const verifyTokenAsync = (token, secretKey) => new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        reject(error);
      } else {
        resolve(decoded);
      }
    });
  });

  // Use async/await or .then/.catch for error handling
  verifyTokenAsync(token, secretKey)
    .then(decoded => {
        req.decoded=decoded;
      next(); // Pass decoded payload to next middleware or route handler
    })
    .catch(error => {
      console.error(error); // Log the error for debugging
      return res.status(401).json({ error: 'Unauthorized' });
    });
};

module.exports = verifyToken;
