import Sequelize from 'sequelize';
import dotenv from 'dotenv';

import UserModel from './models/user.js';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
});

export const User = UserModel(sequelize, Sequelize)

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection to the DB has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the DB: ', error);
    });

sequelize.sync()
    .then(() => {
        console.log('Database synced!')
    })

export default sequelize;