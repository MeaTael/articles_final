const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, FavouriteList} = require('../models/models')

const generateJwt = (id, username) => {
    return jwt.sign(
        {id: id, username},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {

    async registration(req, res, next) {
        const {username, password} = req.body
        if (!username || !password) {
            return next(ApiError.badRequest('Wrong username or password'))
        }
        const candidate = await User.findOne({where: {username: username}})
        if (candidate) {
            return next(ApiError.badRequest('User already exists'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({username, password: hashPassword})
        const favouriteList = await FavouriteList.create({userId: user.id})
        const token = generateJwt(user.id, user.username)
        return res.json(token)
    }

    async login(req, res, next) {
        const {username, password} = req.body
        const user = await User.findOne({where: {username: username}})
        if (!user) {
            return next(ApiError.badRequest("User not found"))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.badRequest("Wrong password"))
        }
        const token = generateJwt(user.id, user.username)
        return res.json(token)
    }

    async auth(req, res, next) {
        const token = generateJwt(req.user.id, req.user.username)
        res.json(token)
    }

}

module.exports = new UserController()