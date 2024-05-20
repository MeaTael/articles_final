const Router = require('express')
const router = new Router()
const articleController = require('../controllers/articleController')

router.post('/create', articleController.create)
router.get('/getAll', articleController.getAll)
router.get('/getIds', articleController.getIds)
router.get('/getById', articleController.getById)
router.get('/getSummaries', articleController.getSummaries)
router.post('/updateSimilar', articleController.loadSimilar)

module.exports = router