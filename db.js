const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

const UserModel = require('./models/user');
const EducationModel = require('./models/education');
const ResearchModel = require('./models/research');

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
    db.User = UserModel(sequelize);
    db.Education = EducationModel(sequelize);
    db.Research = ResearchModel(sequelize);

    db.User.hasMany(db.Education, { foreignKey: 'userId' });
    db.Education.belongsTo(db.User, { foreignKey: 'userId' });

    db.User.hasMany(db.Research, { foreignKey: 'userId' });
    db.Research.belongsTo(db.User, { foreignKey: 'userId' });

    // sync all models with database
    await sequelize.sync();
}