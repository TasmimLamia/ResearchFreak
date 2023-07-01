const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

const UserModel = require('./models/user');

dotenv.config();

module.exports = db = {};

initialize();

async function initialize() {
    // connect to db
    const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
        host: process.env.DATABASE_HOST,
        dialect: process.env.DATABASE_DIALECT,
    });

    // init models and add them to the exported db object
    db.User = UserModel(sequelize, Sequelize);

    // sync all models with database
    await sequelize.sync();
}