const jwt = require('jsonwebtoken');
const secretKey = 'aaichraqisthebestjaaeyeuenkjdvnkjbnhhjhsdkfbkjnikqsd'; 

const verifyDoctorToken = (req, res, next) => {
  
  const token = req.headers.cookie
    .split('; ') 
    .find((row) => row.startsWith('Doctoken=')) 
    ?.split('=')[1]; 
console.log(token)
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Wrap verification in a promise-based function
  const verifyDocTokenAsync = (token, secretKey) => new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        reject(error);
      } else {
        resolve(decoded);
      }
    });
  });

  verifyDocTokenAsync(token, secretKey)
    .then(decoded => {
      req.decoded = decoded;
      next();
    })
    .catch(error => {
      console.error(error); 
      return res.status(401).json({ error: 'Unauthorized' });
    });
};

module.exports = verifyDoctorToken;
