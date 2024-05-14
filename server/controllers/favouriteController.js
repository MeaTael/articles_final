const ApiError = require("../error/ApiError")
const {Article, Favourite, FavouriteList} = require("../models/models")

class FavouriteController {

    async create(req, res, next) {
        try {
            const {listId, articleId} = req.body
            const favourite = await Favourite.create({
                favouriteListId: listId,
                articleId
            })
            return res.json(favourite)
        } catch (e) {
            next(ApiError.badRequest(e))
        }
    }

    async getAll(req, res, next) {
        try {
            const {userId, favouriteListId, page, limit} = req.query
            const favourites = await Favourite.findAndCountAll({
                attributes: ['articleId'],
                include: [
                    {
                        model: FavouriteList,
                        where: {
                            userId,
                            id: favouriteListId,
                        }
                    },
                    {
                        model: Article
                    }
                ],
                limit: limit,
                offset: limit * page
            })
            return res.json(favourites)
        } catch (e) {
            next(ApiError.badRequest(e))
        }
    }

    async remove(req, res, next) {
        try {
            const {listId, articleId} = req.body
            const rowsCount = await Favourite.destroy({
                where: {
                    favouriteListId: listId,
                    articleId
                }
            })
            return res.json(rowsCount)
        } catch (e) {
            next(ApiError.badRequest(e))
        }
    }

}

module.exports = new FavouriteController()