const ApiError = require('../error/ApiError')
const {Conference} = require('../models/models')

class ConferenceController {

    async create(req, res) {
        const {name} = req.body
        const brand = await Conference.create({name})
        return res.json(brand)
    }

    async getAll(req, res) {
        const conferences = await Conference.findAll({
            order: [
                ['name', 'ASC']
            ]
        })
        return res.json(conferences)
    }

}

module.exports = new ConferenceController()