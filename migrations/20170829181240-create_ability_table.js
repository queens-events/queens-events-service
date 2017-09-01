const now = require('../lib/now.js');

const tableName = 'ability';

module.exports = {
	up(queryInterface, Sequelize) {
		return queryInterface
			.createTable(tableName, {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false,
					unique: true,
				},
				description: {
					type: Sequelize.STRING,
					allowNull: true,
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
