const jwt=require('jsonwebtoken');
const secretKey='aaichraqisthebestjaaeyeuenkjdvnkjbnhhjhsdkfbkjnikqsd';

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        jwt.verify(token, secretKey);
             next();
    } catch (error) {
        
        return res.status(401).json({ error: 'Unauthorized' });
    }
};
module.exports=verifyToken;

/*In this middleware, we use the verify function to check the
 validity of the token sent with the request. If the token is valid, the
  middleware calls the next function to pass control to the next 
  middleware function or route handler. If the token is invalid or 
  missing, the middleware returns an error*/