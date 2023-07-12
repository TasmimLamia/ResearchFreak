const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: DataTypes.INTEGER,
        connectId: DataTypes.INTEGER
    };

    const options = {
        defaultScope: {
            attributes: {}
        }
    };

    return sequelize.define('Connection', attributes, options);
}