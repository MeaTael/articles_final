const ApiError = require('../error/ApiError')
const {Comment} = require('../models/models')

class CommentController {

    async create(req, res, next) {
        try {
            const {text, userId, articleId} = req.body
            const datetime = new Date()
            const comment = await Comment.create({
                text,
                datetime,
                userId,
                articleId
            })
            return res.json(comment)
        } catch (e) {
            next(ApiError.badRequest(e))
        }
    }

    async remove(req, res, next) {
        try {
            const {id} = req.body
            const rowsCount = await Comment.destroy({
                where: {
                    id
                }
            })
            return res.json(rowsCount)
        } catch (e) {
            next(ApiError.badRequest(e))
        }
    }

}

module.exports = new CommentController()