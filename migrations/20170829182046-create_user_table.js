const now = require('../lib/now.js');

const tableName = 'user';

module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface
            .createTable(tableName, {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    unique: true,
                    autoIncrement: true,
                },
                email: {
                    type: Sequelize.STRING(126).BINARY,
                    unique: true,
                    allowNull: false,
                },
                firstName: {
                    type: Sequelize.STRING,
                    allowNull: true,

                },
                lastName: {
                    type: Sequelize.STRING,
                    allowNull: true,

                },
                password: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                phone: {
                    type: Sequelize.STRING,

                },
                streetAddress: {
                    type: Sequelize.STRING,

                },
                cityTown: {
                    type: Sequelize.STRING,

                },
                stateProvince: {
                    type: Sequelize.STRING,

                },
                postalCode: {
                    type: Sequelize.STRING,
                },
                country: {
                    type: Sequelize.STRING(2),
                },
                language: {
                    type: Sequelize.STRING,
                },
                timeZone: {
                    type: Sequelize.STRING,
                },
                isActive: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                    allowNull: false,
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: now()
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: now()
                },
            });
    },
    down(queryInterface) {
        return queryInterface.dropTable(tableName);
    },
};
