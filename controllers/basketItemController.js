const {Basket, BasketItem, Item, ItemInfo} = require('./../models/models');
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");
const tokenService = require('../service/tokenService')

class BasketItemController {
    async add(req, res) {
        try {
            const {id} = req.body;
            const token = req.headers.authorization.split(' ')[1];
            const user = tokenService.validateAccessToken(token)
            const basket = await Basket.findOne({where: {userId: user.id}});
            await BasketItem.create({basketId : basket.id, itemId: id});
            return res.json("Item added to cart");
        } catch (e) {
            console.log(e);
        }
    }

    async get(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const user = tokenService.validateAccessToken(token)
            const {id} = await Basket.findOne({where: {userId: user.id}});
            const basket = await BasketItem.findAll({where: {basketId: id}});

            const basketArr = [];
            for(let i = 0; i < basket.length; i++) {
                const basketItem = await Item.findOne({
                        where: {
                            id: basket[i].itemId,
                        },
                        include: {
                            model: ItemInfo, as: "info",
                            where: {
                                itemId: basket[i].itemId,
                                [Op.or]: [
                                    {
                                        itemId: {
                                            [Op.not]: null
                                        }
                                    }
                                ],
                            },
                            required: false}
                        });
                basketArr.push(basketItem);
            }

            return res.json(basketArr);
        } catch (e) {
            console.log(e);
        }
    }

    async delete(req, res) {
        try {
            const {id} = req.params;
            const user = req.user;

            await Basket.findOne({where: {userId: user.id}}).then(async userBasket => {
                if(userBasket.userId === user.id) {
                    await BasketItem.destroy({where: {basketId: userBasket.id, itemId: id}})
                }
                return res.json(`You can't delete the item because it doesn't belong to you.`);
            });
            return res.json("Item removed from cart");
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new BasketItemController();