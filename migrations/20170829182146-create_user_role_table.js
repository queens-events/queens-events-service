const now = require('../lib/now.js');

const tableName = 'userRole';

module.exports = {
	up(queryInterface, Sequelize) {
		return queryInterface
			.createTable(tableName, {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				userId: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'user',
						key: 'id',
					},
				},
				roleId: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'role',
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


