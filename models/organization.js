'use strict'

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Organization', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ownerID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'user',
                key: 'id',
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        websiteUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fbPageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
    }, {
        tableName: 'organization',
        freezeTableName: true,
        timestamps: true,
    });
}