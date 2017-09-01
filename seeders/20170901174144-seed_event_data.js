const _ = require('lodash');
const now = require('../lib/now');
const moment = require('moment');
//const venueData = require('../data/venueData.json');
const eventData = require('../data/eventData.json');

const tableName = 'event'

module.exports = {
	async up(queryInterface, Sequelize) {
		_.map(eventData, (event) => {
			console.log(event.name);

			event.startTime = moment(event.startTime).format('YYYY-MM-DD HH:mm:ss');
			if (event.recurringStartDate) {
				event.recurringStartDate = moment(event.recurringStartDate).format('YYYY-MM-DD HH:mm:ss')
			}
			if (event.recurringEndDate) {
				event.recurringEndDate = moment(event.recurringEndDate).format('YYYY-MM-DD HH:mm:ss')
			}
			
			if (event.endTime) {
				event.endTime = moment(event.endTime).format('YYYY-MM-DD HH:mm:ss')
			} else {
				event.endTime = event.startTime;
			}
			event.createdAt = now(),
			event.updatedAt = now()
		});
	
		return queryInterface.bulkInsert(tableName, eventData, {});
	},
	async down(queryInterface, Sequelize) {
		// await queryInterface.bulkDelete('venue', null, {});
		return queryInterface.bulkDelete(tableName, null, {});
	}
};
