const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        degree: DataTypes.STRING,
        major: DataTypes.STRING,
        institute: DataTypes.STRING,
        country: DataTypes.STRING,
        fromYear: DataTypes.DATEONLY,
        toYear: DataTypes.DATEONLY,
    };

    const options = {
        defaultScope: {
            attributes: {}
        }
    };

    return sequelize.define('Education', attributes, options);
}