const jwt = require('jsonwebtoken');
const secretKey = 'aaichraqisthebestjaaeyeuenkjdvnkjbnhhjhsdkfbkjnikqsd'; 

const verifyAgentToken = (req, res, next) => {
  const token = req.headers.cookie
    .split('; ') 
    .find((row) => row.startsWith('Agenttoken=')) // Find row starting with 'AgentToken='
    ?.split('=')[1]; // Extract value after the '=' sign (if found)

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Wrap verification in a promise-based function
  const verifyAgentTokenAsync = (token, secretKey) => new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        reject(error);
      } else {
        resolve(decoded);
      }
    });
  });

  // Use async/await or .then/.catch for error handling
  verifyAgentTokenAsync(token, secretKey)
    .then(decoded => {
      req.decoded = decoded;
      next(); // Pass decoded payload to next middleware or route handler
    })
    .catch(error => {
      console.error(error); // Log the error for debugging
      return res.status(401).json({ error: 'Unauthorized' });
    });
};

module.exports = verifyAgentToken;
