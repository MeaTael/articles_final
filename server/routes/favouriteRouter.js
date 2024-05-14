const Router = require('express')
const router = new Router()
const favouriteController = require('../controllers/favouriteController')

router.post('/create', favouriteController.create)
router.get('/getAll', favouriteController.getAll)
router.delete('/remove', favouriteController.remove)

module.exports = router