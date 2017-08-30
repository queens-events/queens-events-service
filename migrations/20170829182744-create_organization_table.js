const tableName = 'organization';

module.exports = {
	up(queryInterface, Sequelize) {
		return queryInterface
			.createTable(tableName, {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				ownerID: {
					type: Sequelize.INTEGER,
					allowNull: true,
					references: {
						model: 'user',
						key: 'id',
					},
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				description: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				websiteUrl: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				fbPageUrl: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				phone: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				created_at: {
					type: Sequelize.DATE,
					defaultValue: Sequelize.NOW,
					allowNull: false,
				},
				updated_at: {
					type: Sequelize.DATE,
					defaultValue: Sequelize.NOW,
					allowNull: false,
				},
			})
	},

	down(queryInterface, Sequelize) {
		return queryInterface.dropTable(tableName);
	}
};

