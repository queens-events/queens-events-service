const tableName = 'venue';

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
				},
				address: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				city: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				province: {
					type: Sequelize.STRING(2),
					allowNull: false,
				},
				country: {
					type: Sequelize.STRING(2),
					allowNull: false,
				},
				postal: {
					type: Sequelize.STRING(7),
					allowNull: false
				},
				lat: {
					type: Sequelize.FLOAT,
					allowNull: true,
				},
				long: {
					type: Sequelize.FLOAT,
					allowNull: true,
				},
				accessability: {
					type: Sequelize.BOOLEAN,
					allowNull: true,
				},
				createdAt: {
					type: Sequelize.DATE,
					defaultValue: Sequelize.NOW,
					allowNull: false,
				},
				updatedAt: {
					type: Sequelize.DATE,
					defaultValue: Sequelize.NOW,
					allowNull: false,
				}
			})
	},

	down(queryInterface, Sequelize) {
		return queryInterface.dropTable(tableName);
	}
};

