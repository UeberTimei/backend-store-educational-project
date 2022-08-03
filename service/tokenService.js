const { Token } = require("../models/models")
const jwt = require('jsonwebtoken')

class TokenService {
    generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.SECRET_KEY_ACCESS, {expiresIn: '24h'})
        const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESH, {expiresIn: '30d'})
        return {accessToken, refreshToken}
    }

    validateAccessToken(token){
        try {
            const userData = jwt.verify(token, process.env.SECRET_KEY_ACCESS)
            return userData
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token){
        try {
            const userData = jwt.verify(token, process.env.SECRET_KEY_REFRESH)
            return userData
        } catch (e) {
            return null
        }
    }

    async saveToken(userId, refreshToken){
        const tokenData = await Token.findOne({where: {userId}})
        if(tokenData){
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const token = await Token.create({userId, refreshToken})
        return token
    }

    async removeToken(refreshToken){
        const tokenData = await Token.destroy({where: {refreshToken}})
        return tokenData
    }

    async findToken(refreshToken){
        const tokenData = await Token.findOne({where: {refreshToken}})
        return tokenData
    }
}

module.exports = new TokenService()