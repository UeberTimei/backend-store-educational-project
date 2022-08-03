const ApiError = require('../error/ApiError')
const tokenService = require('../service/tokenService')

module.exports = function(req, res, next){
    if(req.method === "OPTIONS"){
        next()
    }
    try {
        const token = req.headers.authorization
        if(!token){
            return next(ApiError.unauthorizedError())
        }

        const accessToken = token.split(' ')[1]
        if(!accessToken){
            return next(ApiError.unauthorizedError())
        }

        const userData = tokenService.validateAccessToken(accessToken)
        if(!userData){
            return next(ApiError.unauthorizedError())
        }

        req.user = userData
        next()
    } catch (e) {
        return next(ApiError.unauthorizedError())
    }
}