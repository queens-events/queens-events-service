const venueData = require('../data/venueData.json');

const tableName = 'venue'

module.exports = {
	up(queryInterface, Sequelize) {
		return queryInterface.bulkInsert(tableName, venueData, {});
	},
	down(queryInterface, Sequelize) {
		return queryInterface.bulkDelete(tableName, null, {});
	}
};
