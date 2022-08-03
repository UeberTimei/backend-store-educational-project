const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const {body} = require('express-validator')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/registration',
    body('email').isEmail().notEmpty(), 
    body('password').isLength({min: 8, max: 16}).notEmpty(), 
    userController.registration)
router.post('/login', body('email').isEmail().notEmpty(), body('password').notEmpty(), userController.login)
router.post('/logout', authMiddleware, userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)


router.put('/put', authMiddleware, body('password').isLength({min: 8, max: 16}).notEmpty(), userController.update)
router.delete('/:id', authMiddleware, userController.delete)


router.get('/', checkRole('ADMIN'), userController.getUsers)

module.exports = router