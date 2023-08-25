const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        owner: DataTypes.INTEGER,
        title: DataTypes.STRING,
        details: DataTypes.STRING(1024),
        date: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW
        }
    };

    const options = {
        defaultScope: {
            attributes: {}
        }
    };

    return sequelize.define('Project', attributes, options);
}