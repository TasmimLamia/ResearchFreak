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
        year: DataTypes.STRING,
        link: DataTypes.STRING
    };

    const options = {
        defaultScope: {
            attributes: {}
        }
    };

    return sequelize.define('Research', attributes, options);
}