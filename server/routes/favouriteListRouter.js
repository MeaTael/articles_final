const Router = require('express')
const router = new Router()
const favouriteListController = require('../controllers/favouriteListController')

router.post('/create', favouriteListController.create)
router.get('/getAll', favouriteListController.getAll)
router.delete('/remove', favouriteListController.remove)

module.exports = router