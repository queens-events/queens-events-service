const now = require('../lib/now');

const tableName = 'user';

module.exports = {
	async up(queryInterface, Sequelize) { 
		const userId = await queryInterface.bulkInsert(tableName, 
			[{
				email: "superuser@test.com",
				firstName: "Super",
				lastName: "User",
				phone: "555-555-5555",
				streetAddress: "123 Superuser St.",
				cityTown: "Kingston",
				stateProvince: "ON",
				postalCode: "K0A 1S4",
				country: "ca",
				language: "en",
				isActive: true,
				createdAt: now(),
				updatedAt: now(),
			}], {});

		return queryInterface.bulkInsert('userRole', 
			[{
				userId,
				roleId: 1,
				createdAt: now(),
				updatedAt: now(),
			}], {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('userRole', null, {});
		return queryInterface.bulkDelete(tableName, null, {});
	}
};
