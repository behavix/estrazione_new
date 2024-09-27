const jwt = require('jsonwebtoken');

exports.handler = async function(event) {
    // Generate a token
    const secretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ isValid: true }, secretKey, { expiresIn: '2m' });

    // Obtain current url
    const host = event.headers.host;
    const protocol = event.headers['x-forwarded-proto'] || 'http';
    const origin = `${protocol}://${host}`;
    // Create destination url
    const pathname = '/tenta-la-fortuna';
    const redirectUrl = `${origin}${pathname}?token=${token}`;
    
    return {
        statusCode: 302,
        headers: {
            Location: redirectUrl,
        },
    };
};