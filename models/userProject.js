const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        }
    };

    const options = {
        defaultScope: {
            attributes: {}
        }
    };

    return sequelize.define('UserProject', attributes, options);
}