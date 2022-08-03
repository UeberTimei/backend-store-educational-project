const {Basket, BasketItem} = require('./../models/models');

module.exports = async function (req, res, next) {
    try {
        const {id} = req.params;
        const user = req.user;
        const userBasket = await Basket.findOne({where: {userId: user.id}});
        const basketItem = await BasketItem.findOne({where: {basketId: userBasket.id, itemId: id}});

        if(basketItem) {
            return next();
        }
        return res.json("This item is not in the cart");
    } catch (e) {
        res.json(e);
    }
};