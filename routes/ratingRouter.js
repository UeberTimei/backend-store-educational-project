const Router = require('express')
const router = new Router()
const ratingController = require('../controllers/ratingController')
const authMiddleware = require('../middleware/authMiddleware')
const checkSetRate = require('../middleware/checkSetRate')


router.post('/', authMiddleware, checkSetRate, ratingController.set)
router.post('/check', authMiddleware,  ratingController.checkRating)

module.exports = router