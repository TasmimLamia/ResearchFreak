const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: DataTypes.STRING,
        details: DataTypes.STRING(1024),
        contributors: DataTypes.INTEGER,
    };

    const options = {
        defaultScope: {
            attributes: {}
        }
    };

    return sequelize.define('Project', attributes, options);
}