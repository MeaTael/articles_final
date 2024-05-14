const Router = require('express')
const router = new Router()
const commentController = require('../controllers/commentController')

router.post('/create', commentController.create)
router.delete('/remove', commentController.remove)

module.exports = router