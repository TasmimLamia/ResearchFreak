const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        password: DataTypes.STRING(1024),
        pic: DataTypes.BLOB("long"),
        bio: DataTypes.STRING,
        website: DataTypes.STRING,
        socialmedia: DataTypes.STRING,
        gender: DataTypes.STRING,
        country: DataTypes.STRING,
        interest: DataTypes.STRING
    };

    const options = {
        defaultScope: {
            // exclude password by default
            attributes: { exclude: ['password'] }
        },
        scopes: {
            // include password with this scope
            withPassword: { attributes: {}, }
        }
    };

    return sequelize.define('User', attributes, options);
}