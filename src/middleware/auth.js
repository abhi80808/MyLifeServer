const jwt = require('jsonwebtoken');

module.exports = verifyToken = (token) => {
    const username = jwt.verify(token, 'private')['data'];
    return username;
}