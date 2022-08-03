const Router = require('express')
const router = new Router()
const itemController = require('../controllers/itemController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post('/', checkRoleMiddleware('ADMIN'), itemController.create)
router.put('/:id', checkRoleMiddleware('ADMIN'), itemController.update)
router.delete('/:id', checkRoleMiddleware('ADMIN'), itemController.delete)

router.get('/', itemController.getAll)
router.get('/:id', itemController.getOne)

module.exports = router