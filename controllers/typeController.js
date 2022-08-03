const {Type, Item, BasketItem} = require('../models/models')
const ApiError = require('../error/ApiError')

class TypeController {
    async create(req, res){
        const {name} = req.body
        const type = await Type.create({name})
        return res.json(type)
    }
    async getAll(req, res){
        const types = await Type.findAll()
        return res.json(types)
    }

    async delete(req, res){
        try {
            const {id} = req.params
            const type = await Type.findOne({where: {id: id}})
            if(!type){
                throw ApiError.badRequest('This type does not exist')
            }
            const item = await Item.findOne({where: {typeId: type.id}})
            if(item){
                await Item.destroy({where:{typeId: type.id}})
                await BasketItem.destroy({where: {itemId: item.id}})
            }
            await type.destroy()
            return res.json({message: "Type deleted successfully"})
        } catch (e) {
            console.log(e)
            throw ApiError.badRequest('An unexpected error has occurred')
        }
    }

    async update(req, res){
        try {
            const {id} = req.params
            const {name} = req.body

            await Type.findOne({where: {id}}).then(async data => {
                if(data){
                    let newType ={}
                    name ? newType.name = name : false

                    await Type.update({...newType}, {where:{id}}).then(() => {
                        return res.json('Type updated')
                    })
                } else {
                    return res.json('This type does not exist')
                }
            })
        } catch (e) {
            return res.json(e);
        }
    }
}

module.exports = new TypeController()