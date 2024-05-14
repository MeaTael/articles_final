const Router = require('express')
const router = new Router()
const articleRouter = require('./articleRouter')
const conferenceRouter = require('./conferenceRouter')
const userRouter = require('./userRouter')
const favouriteRouter = require("./favouriteRouter")
const favouriteListRouter = require("./favouriteListRouter")
const commentRouter = require("./commentRouter")

router.use('/user', userRouter)
router.use('/article', articleRouter)
router.use('/conference', conferenceRouter)
router.use('/favourite', favouriteRouter)
router.use('/favouriteList', favouriteListRouter)
router.use('/comment', commentRouter)

module.exports = router