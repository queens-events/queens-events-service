const tableName = 'roleAbility';

module.exports = {
	up(queryInterface, Sequelize) {
		return queryInterface
			.createTable(tableName, {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				roleId: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'role',
						key: 'id',
					},
				},
				abilityId: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'ability',
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

