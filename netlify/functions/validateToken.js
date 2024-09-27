const jwt = require('jsonwebtoken');

exports.handler = async function(event) {
    const token = event.queryStringParameters.token;
    const secretKey = process.env.JWT_SECRET_KEY;

    try {
        const decoded = jwt.verify(token, secretKey);

        return {
            statusCode: 200,
            body: JSON.stringify({ isValid: true }),
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ isValid: false, message: 'Token invalido' }),
        };
    }
};