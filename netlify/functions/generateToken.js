const jwt = require('jsonwebtoken');
const config = require('./config/config.json');

exports.handler = async function(event) {
    // Generate a token
    const secretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ isValid: true }, secretKey, { expiresIn: '2m' });
  
    // Create destination url
    const origin = config.url;
    const pathname = '/tenta-la-fortuna';
    const redirectUrl = `${origin}${pathname}?token=${token}`;
    
    return {
        statusCode: 302,
        headers: {
            Location: redirectUrl,
        },
    };
};
