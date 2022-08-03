const ApiError = require("../error/ApiError")
const { Rating, Item, ItemInfo } = require("../models/models")
const tokenService = require('../service/tokenService')

class RatingController {
    async set(req, res, next){
        try {
            const {itemId, rate} = req.body

            const token = req.headers.authorization.split(' ')[1]
            if(!token){
                return next(ApiError.unauthorizedError())
            }

            const user = tokenService.validateAccessToken(token)
            if(!user){
                return next(ApiError.unauthorizedError())
            }

            const item = Item.findOne({where: {id: itemId}})

            await Rating.create({userId: user.id, itemId, rate})

            let rating = await Rating.findAndCountAll({where:{itemId}})
            let sumOfAllRatings = 0;
            let middleRating;

            rating.rows.forEach(prod => sumOfAllRatings += Number(prod.rate));
            middleRating = Math.round(Number(sumOfAllRatings) / Number(rating.count) * 100) / 100

            await Item.update({rating: middleRating}, {where:{id: itemId}})
            return res.json('Rated')
        } catch (e) {
            console.log(e)
        }
    }

    async checkRating(req, res, next){
        try {
            const {itemId} = req.body;
            const token = req.headers.authorization.split(' ')[1];
            const user = tokenService.validateAccessToken(token)
            const checkRating = await Rating.findOne({where: {itemId, userId: user.id}});
            const checkItem = await Item.findOne({where: {id: itemId}});
            if (!checkItem) {
                return res.json({allow: false});
            } else if(checkRating && checkItem) {
                return res.json({allow: false});
            }
            return res.json({allow: true});
        } catch (e) {
            return res.status(401).json("An unexpected error has occurred");
        }
    }
}

module.exports = new RatingController()