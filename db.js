const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

const UserModel = require('./models/user');
const EducationModel = require('./models/education');
const ResearchModel = require('./models/research');
const ConnectionModel = require('./models/connection');
const ConnectionRequestModel = require('./models/connectionRequest');
const ProjectModel = require('./models/project');
const UserProjectModel = require('./models/userProject');
const ReviewModel = require('./models/review');

dotenv.config();

module.exports = db = {};

initialize();

async function initialize() {
    // connect to db
    const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
        host: process.env.DATABASE_HOST,
        dialect: process.env.DATABASE_DIALECT,
        logging: false
    });

    // init models and add them to the exported db object
    db.User = UserModel(sequelize);
    db.Education = EducationModel(sequelize);
    db.Research = ResearchModel(sequelize);
    db.Connection = ConnectionModel(sequelize);
    db.ConnectionRequest = ConnectionRequestModel(sequelize);
    db.Project = ProjectModel(sequelize);
    db.UserProject = UserProjectModel(sequelize);
    db.Review = ReviewModel(sequelize);

    db.User.hasMany(db.Education);
    db.Education.belongsTo(db.User);

    db.User.hasMany(db.Research);
    db.Research.belongsTo(db.User);

    // NEED TO REDO THIS SINCE THIS RELATIONSHIPS ARE NOT CORRECTAdd association for many to many relationship
    db.Review.belongsTo(db.User, { foreignKey: 'reviewerId', as: 'reviewerUsers' });
    db.Review.belongsTo(db.User, { foreignKey: 'revieweeId', as: 'revieweeUsers' });
    db.User.belongsToMany(db.User, { through: db.Review, foreignKey: 'reviewerId', as: 'reviewerUsers' });
    db.User.belongsToMany(db.User, { through: db.Review, foreignKey: 'revieweeId', as: 'revieweeUsers' });

    db.Connection.belongsTo(db.User, { foreignKey: 'connectId', as: 'mainUsers' });
    db.Connection.belongsTo(db.User, { foreignKey: 'userId', as: 'connectingUsers' });
    db.User.belongsToMany(db.User, { through: db.Connection, foreignKey: 'connectId', as: 'mainUsers' });
    db.User.belongsToMany(db.User, { through: db.Connection, foreignKey: 'userId', as: 'connectingUsers' });

    db.ConnectionRequest.belongsTo(db.User, { foreignKey: 'requesterId', as: 'requestedUsers' });
    db.ConnectionRequest.belongsTo(db.User, { foreignKey: 'userId', as: 'requesterUsers' });
    db.User.belongsToMany(db.User, { through: db.ConnectionRequest, foreignKey: 'requesterId', as: 'requestedUsers' });
    db.User.belongsToMany(db.User, { through: db.ConnectionRequest, foreignKey: 'userId', as: 'requesterUsers' });

    db.UserProject.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id', as: 'Users' });
    db.UserProject.belongsTo(db.Project, { foreignKey: 'projectId', targetKey: 'id', as: 'Projects' });
    db.User.belongsToMany(db.Project, { through: db.UserProject, foreignKey: 'userId' });
    db.Project.belongsToMany(db.User, { through: db.UserProject, foreignKey: 'projectId' });

    // sync all models with database
    await sequelize.sync();
}