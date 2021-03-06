const now = require('../lib/now.js');

const tableName = 'event';

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
				description: {
					type: Sequelize.STRING,
				},
				qeUrl: {
					type: Sequelize.STRING,
				},
				itemUrl: {
					type: Sequelize.STRING,
				},
				fbEventUrl: {
					type: Sequelize.STRING,
				},
				imageUrl: {
					type: Sequelize.STRING,
				},
				ownerID: {
					type: Sequelize.INTEGER,
					allowNull: true,
					references: {
						model: 'user',
						key: 'id',
					},
				},
				category: {
					type: Sequelize.ENUM,
					values: ['CONCERTS', 'MOVIES', 'ARTS_AND_THEATER', 'EDUCATIONAL', 'HEALTH', 'SPORTS', 'SOCIALS'],
				},
				tag: {
					type: Sequelize.ENUM,
					values: ['ALL_AGES', '19+_SOCIAL'],
				},
				venueString: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				venueID: {
					type: Sequelize.INTEGER,
					allowNull: true,
					references: {
						model: 'venue',
						key: 'id',
					},
				},
				organizationID: {
					type: Sequelize.INTEGER,
					allowNull: true,
					references: {
						model: 'organization',
						key: 'id',
					}
				},
				cost: {
					type: Sequelize.DOUBLE,
					allowNull: true,
				},
				capacity: {
					type: Sequelize.INTEGER,
					allowNull: true,
				},
				interested: {
					type: Sequelize.INTEGER,
					allowNull: true,
				},
				attending: {
					type: Sequelize.INTEGER,
					allowNull: true,
				},
				all_day: {
					type: Sequelize.BOOLEAN,
					allowNull: true,
				},
				recurring: {
					type: Sequelize.ENUM,
					values: [
						'DAILY',
						'EVERY_OTHER_DAY',
						'WEEKLY',
						'BIWEEKLY',
						'FIRST_OF_THE_MONTH',
						'MONTHLY',
						'ANNUAL'
					],
				},
				recurringStartDate: {
					type: Sequelize.DATE,
					allowNull: true,
				},
				recurringEndDate: {
					type: Sequelize.DATE,
					allowNull: true,
				},
				startTime: {
					type: Sequelize.DATE,
					allowNull: false,
				},
				endTime: {
					type: Sequelize.DATE,
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
				isActive: {
					type: Sequelize.BOOLEAN,
					defaultValue: false,
					allowNull: false,
				}
			})
	},

	down(queryInterface, Sequelize) {
		return queryInterface.dropTable(tableName);
	}
};


