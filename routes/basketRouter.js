const Router = require('express')
const basketItemController = require('../controllers/basketItemController')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')
const checkDeleteBasketItem = require('./../middleware/checkDeleteBasketItem');

router.post('/', authMiddleware, basketItemController.add)
router.get('/', authMiddleware, basketItemController.get)
router.delete('/:id', authMiddleware, checkDeleteBasketItem, basketItemController.delete)


module.exports = router