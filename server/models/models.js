const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    username: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
})

const FavouriteList = sequelize.define('favourite_list', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, default: "Common"}
})

const Favourite = sequelize.define('favourite', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Article = sequelize.define('article', {
    id: {type: DataTypes.TEXT, primaryKey: true},
    title: {type: DataTypes.TEXT, unique: true, allowNull: false},
    published: {type: DataTypes.DATE},
    links: {type: DataTypes.TEXT, allowNull: false},
    articleRating: {type: DataTypes.INTEGER},
    authorRating: {type: DataTypes.INTEGER},
    summary: {type: DataTypes.TEXT, allowNull: false},
    authors: {type: DataTypes.TEXT, allowNull: false},
    references: {type: DataTypes.JSON, allowNull: false},
    citations: {type: DataTypes.JSON, allowNull: false},
    similarArticles: {type: DataTypes.JSON}
})

const Conference = sequelize.define('conference', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
})

const Comment = sequelize.define('comment', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    datetime: {type: DataTypes.DATE, allowNull: false},
    text: {type: DataTypes.TEXT, allowNull: false},
})

User.hasMany(FavouriteList)
FavouriteList.belongsTo(User)

User.hasMany(Comment)
Comment.belongsTo(User)

FavouriteList.hasMany(Favourite, {onDelete: "CASCADE"})
Favourite.belongsTo(FavouriteList)

Article.hasMany(Favourite)
Favourite.belongsTo(Article)

Article.hasMany(Comment)
Comment.belongsTo(Article)

Conference.hasMany(Article)
Article.belongsTo(Conference)

module.exports = {
    User,
    FavouriteList,
    Favourite,
    Article,
    Conference,
    Comment
}