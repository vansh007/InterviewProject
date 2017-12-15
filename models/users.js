module.exports = function(sequelize, DataTypes) {
    return sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        FirstName: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        LastName: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        Email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        Password: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        verified: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: '0'
        },
        VerifyCode: {
            type: DataTypes.DOUBLE(40),
            allowNull: false
        }
    }, {
        tableName: 'users',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    });
};