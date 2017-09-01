const now = require('../lib/now.js');

const tableName = 'organizationUser';

module.exports = {
	up(queryInterface, Sequelize) {
		return queryInterface
			.createTable(tableName, {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				organizationId: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'organization',
						key: 'id',
					},
				},
				userRoleId: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'userRole',
						key: 'id',
					},
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
				}
			})
	},

	down(queryInterface, Sequelize) {
		return queryInterface.dropTable(tableName);
	}
};

