const Router = require('express')
const router = new Router()
const conferenceController = require('../controllers/conferenceController')

router.post('/create', conferenceController.create)
router.get('/getAll', conferenceController.getAll)

module.exports = router