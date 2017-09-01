const now = require('../lib/now.js');

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('UserRole', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id',
            },
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'role',
                key: 'id',
            },
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: now()
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: now()
        }
    }, {
        tableName: 'userRole',
        freezeTableName: true,
        timestamps: true,
    });
};