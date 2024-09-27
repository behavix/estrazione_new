exports.handler = async function(event) {

    const params = new URLSearchParams(event.queryStringParameters);
    const valid = params.get('valid');

    if (valid === 'true') {
        return {
            statusCode: 200,
            body: JSON.stringify({ isValid: true }),
        };
    }

    return {
        statusCode: 400,
        body: JSON.stringify({ isValid: false, message: 'Accesso non consentito' }),
    };
};