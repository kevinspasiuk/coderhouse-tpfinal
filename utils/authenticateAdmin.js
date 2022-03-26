const UnauthorizedError = require('../model/errors.js');

const authenticate = function (req, res, next) {

    if (!req.session.userId || (req.session.userRol != "admin") ) {
        throw new UnauthorizedError
    } 
    next();
};

module.exports = authenticate;