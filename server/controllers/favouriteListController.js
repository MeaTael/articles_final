const ApiError = require('../error/ApiError')
const {Conference} = require("../models/models");
const {User} = require("../models/models");
const {Favourite} = require("../models/models");
const {FavouriteList, Comment} = require("../models/models");
const {Article} = require('../models/models')
const {Op} = require('sequelize')

class FavouriteListController {

    async create(req, res, next) {
        try {
            const {name, userId} = req.body
            if (!name || !userId) {
                return next(ApiError.badRequest('Bad parameters specified'))
            }
            const favList = await FavouriteList.create({
                name, userId
            })
            return res.json(favList)
        } catch (e) {
            next(ApiError.badRequest(e))
        }
    }

    async getAll(req, res, next) {
        try {
            const {userId} = req.query
            const favouriteLists = await FavouriteList.findAndCountAll({
                where: {
                    userId,
                    // name: { [Op.not] : "default" }
                }
            })
            return res.json(favouriteLists)
        } catch (e) {
            next(ApiError.badRequest(e))
        }
    }

    async remove(req, res, next) {
        try {
            const {id} = req.body
            if (!id) {
                return next(ApiError.badRequest('No user id'))
            }
            const rowsCount = await FavouriteList.destroy({
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

module.exports = new FavouriteListController()