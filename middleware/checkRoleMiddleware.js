const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError');
const tokenService = require('../service/tokenService');

module.exports = function(role) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1]
            if(!token){
                return next(ApiError.unauthorizedError())
            }

            const userData = jwt.verify(token, process.env.SECRET_KEY_ACCESS)
            if(userData.role !== role){
                return next(ApiError.forbidden())
            }

            req.user = userData
            next()
        } catch (e) {
            return next(ApiError.unauthorizedError())
        }
    };
}
