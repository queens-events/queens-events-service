const _ = require('lodash');
const now = require('../lib/now');
const moment = require('moment');
const eventData = require('../data/eventData10-HOCO.json');

const tableName = 'event'

module.exports = {
	async up(queryInterface, Sequelize) {
		_.map(eventData, (event) => {
			console.log(event)
			event.startTime = moment(event.startTime).add(3, 'months').format('YYYY-MM-DD HH:mm:ss');
			if (event.recurringStartDate) {
				event.recurringStartDate = moment(event.recurringStartDate).add(3, 'months').format('YYYY-MM-DD HH:mm:ss')
			}
			if (event.recurringEndDate) {
				event.recurringEndDate = moment(event.recurringEndDate).add(3, 'months').format('YYYY-MM-DD HH:mm:ss')
			}
			
			if (event.endTime) {
				event.endTime = moment(event.endTime).add(3, 'months').format('YYYY-MM-DD HH:mm:ss')
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
