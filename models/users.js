'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        phone: {
            type: DataTypes.STRING,

        },
        streetAddress: {
            type: DataTypes.STRING,

        },
        cityTown: {
            type: DataTypes.STRING,

        },
        stateProvince: {
            type: DataTypes.STRING,

        },
        postalCode: {
            type: DataTypes.STRING,
        },
        country: {
            type: DataTypes.STRING,
        },
        language: {
            type: DataTypes.STRING,
        },
        timeZone: {
            type: DataTypes.STRING,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.NOW,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.NOW,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        }
    });

    return User;
};