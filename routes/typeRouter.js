const Router = require('express')
const router = new Router()
const typeController = require('../controllers/typeController')
const checkRole = require('../middleware/checkRoleMiddleware')
const {body} = require('express-validator')

router.post('/', checkRole('ADMIN'), body('name').isString(), typeController.create)
router.put('/:id', checkRole('ADMIN'), body('name').isString(), typeController.update)
router.delete('/:id', checkRole('ADMIN'), typeController.delete)

router.get('/', typeController.getAll)


module.exports = router