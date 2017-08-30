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
					defaultValue: Sequelize.NOW
				},
				updatedAt: {
					type: Sequelize.DATE,
					allowNull: false,
					defaultValue: Sequelize.NOW
				}
			})
	},

	down(queryInterface, Sequelize) {
		return queryInterface.dropTable(tableName);
	}
};

