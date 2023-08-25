const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        rating: DataTypes.INTEGER,
        review: DataTypes.STRING
    };

    const options = {
        defaultScope: {
            attributes: {}
        }
    };

    return sequelize.define('Review', attributes, options);
}