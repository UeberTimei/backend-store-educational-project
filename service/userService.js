const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const {User, Basket} = require('../models/models')
const mailService = require('./mailService')
const tokenService = require('./tokenService')
const UserDto = require('../dto/userDto')
const uuid = require('uuid')


class UserService {
    async registration(email, password, role){
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            throw ApiError.badRequest("User with this Email is already taken")
        }

        const hashPassword = await bcrypt.hash(password, 6)
        const activationLink = uuid.v4()

        const user = await User.create({email, role, password: hashPassword, activationLink})
        const basket = await Basket.create({userId: user.id})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`)

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {...tokens, user: userDto}
    }

    async activate(activationLink){
        const user = await User.findOne({where: {activationLink}})
        if(!user){
            throw ApiError.badRequest('Incorrect activation link')
        }
        user.isActivated = true
        await user.save()
    }

    async login(email, password){
        const user = await User.findOne({where: {email}})
        if(user.isActivated === false){
            throw ApiError.badRequest("Verify your account")
        }
        if(!user){
            throw ApiError.badRequest("User with this email does not exist")
        }
        

        const isPassEquals = await bcrypt.compare(password, user.password)
        if(!isPassEquals){
            throw ApiError.badRequest("Wrong password!")
        }

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {...tokens, user: userDto}
    }

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.unauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDB = await tokenService.findToken(refreshToken)
        if(!userData || !tokenFromDB){
            throw ApiError.unauthorizedError()
        }
        const user = await User.findOne({where: {id: userData.id}})
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {...tokens, user: userDto}
    }

    async getAllUsers(){
        const users = await User.findAll()
        return users
    }

    async delete(id){
        const user = await User.findOne({where: {id}})
        await user.destroy()
        return user
    }

    async updatePass(email, password){
        const user = await User.findOne({where: {email}})

        if(!user){
            throw ApiError.badRequest("User doesn't exist")
        }

        const isPassEquals = await bcrypt.compare(password, user.password)

        if(!isPassEquals){
            const hashPassword = await bcrypt.hash(password, 6)
            user.password = hashPassword
            user.save()
            const userDto = new UserDto(user)
            const tokens = tokenService.generateTokens({...userDto})
            await tokenService.saveToken(userDto.id, tokens.refreshToken)
            return {...tokens, user: userDto}
        }
        if(isPassEquals){
            throw ApiError.badRequest("You entered your old password")
        }

        user.save()
        return user
    }
}

module.exports = new UserService()