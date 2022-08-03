const {Rating, Item} = require('./../models/models');
const tokenService = require('../service/tokenService')

module.exports = async function (req, res, next) {
    try {
        const {itemId} = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const user = tokenService.validateAccessToken(token)
        const checkRating = await Rating.findOne({where: {itemId, userId: user.id}});
        const checkItems =  await Item.findOne({where: {id: itemId}});

        if (!checkItems) {
            return res.json("There is no such thing");
        } else if(checkRating && checkItems) {
            return res.json("You have already rated this item");
        }
        return next();
    } catch (e) {
        return res.status(401).json("An error has occurred");
    }
};
