const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

const UserModel = require('./models/user');
const EducationModel = require('./models/education');
const ResearchModel = require('./models/research');
const ConnectionModel = require('./models/connection');

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
    db.Connection = ConnectionModel(sequelize);

    db.User.hasMany(db.Education, { foreignKey: 'userId' });
    db.Education.belongsTo(db.User, { foreignKey: 'userId' });

    db.User.hasMany(db.Research, { foreignKey: 'userId' });
    db.Research.belongsTo(db.User, { foreignKey: 'userId' });


    // db.User.belongsToMany(db.User, {
    //     through: "connection",
    //     as: "connections",
    //     foreignKey: "userId",
    // });

    // db.User.belongsToMany(db.User, {
    //     through: "connection",
    //     as: "users",
    //     foreignKey: "connectionId",
    // });
    db.Connection.belongsTo(db.User, { foreignKey: 'userId', as: 'mainUserId' });
    db.Connection.belongsTo(db.User, { foreignKey: 'connectId', as: 'connectingUserId' });

    // db.User.belongsToMany(db.User, { through: 'Connections', as: 'Connects' });


    // sync all models with database
    await sequelize.sync();
}