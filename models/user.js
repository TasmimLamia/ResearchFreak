export default (sequelize, type) => {
    return sequelize.define('user', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: type.STRING,
            unique: true
        },
        email: {
            type: type.STRING,
            unique: true
        },
        password: type.STRING(1024)
    })
}