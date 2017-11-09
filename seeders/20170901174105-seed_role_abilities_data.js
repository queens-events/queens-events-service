const _ = require('lodash');
const now = require('../lib/now');

const tableName = 'roleAbility';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert('role', 
			[{
				id: 1,
				name: 'superuser',
				createdAt: now(),
				updatedAt: now(),
			},
			{
				id: 2,
				name: 'user',
				createdAt: now(),
				updatedAt: now(),
			}], {});
		
		await queryInterface.bulkInsert('ability',
			[{
	            id: 1,
	            name: 'createUsers',
	        },
	        {
	            id: 2,
	            name: 'viewUsers',
	        },
	        {
	            id: 3,
	            name: 'modifyUsers'
	        },
	        {
	            id: 4,
	            name: 'archiveUsers'
	        },
	        // Events
	        {
	            id: 5,
	            name: 'createEvents',
	        },
	        {
	            id: 6,
	            name: 'viewEvents',
	        },
	        {
	            id: 7,
	            name: 'modifyEvents'
	        },
	        {
	            id: 8,
	            name: 'archiveEvents'
	        },
	        // Organizations
	        {
	            id: 9,
	            name: 'createOrganizations'
	        },
	        {
	            id: 10,
	            name: 'viewOrganizations',
	        },
	        {
	            id: 11,
	            name: 'modifyOrganizations'
	        },
	        {
	            id: 12,
	            name: 'archiveOrganizations'
	        },
	        // Venues
	        {
	            id: 13,
	            name: 'createVenues'
	        },
	        {
	            id: 14,
	            name: 'viewVenues'
	        },
	        {
	            id: 15,
	            name: 'modifyVenues'
	        },
	        {
	            id: 16,
	            name: 'archiveVenues'
	        },
	        // Profile
	        {
	            id: 17,
	            name: 'modifyProfile'
			}], {});

		const superUser = {
			role: 1,
			abilities: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17] 
		};

		const user = {
			role: 2,
			abilities: [17]
		};

		const roleAbilities = [];

		_.forEach([superUser, user], (person) => {
			_.forEach(person.abilities, (ability) => {
				roleAbilities.push({roleId: person.role, abilityId: ability});
			});
		});
			
		return queryInterface.bulkInsert(tableName, roleAbilities, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete(tableName, null, {});
		await queryInterface.bulkDelete('ability', null, {})
		return queryInterface.bulkDelete('role', null, {});
	}
};
