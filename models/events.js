'use strict';

module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
        itemUrl: {
            type: DataTypes.STRING,
        },
        fbEventUrl: {
            type: DataTypes.STRING,
        },
        imageUrl: {
            type: DataTypes.STRING,
        },
        category: {
            type: DataTypes.ENUM,
            values: ['CONCERTS', 'MOVIES', 'ARTS_AND_THEATER', 'EDUCATIONAL', 'HEALTH', 'SPORTS']
        },
        tags: {
            type: DataTypes.ENUM,
            values: ['19_PLUS','ALL_AGES'],
        },
        venueID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'venue',
                key: 'id',
            },
        },
        organizationID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'organization',
                key: 'id',
            }
        },
        // sub_events: {
        //     params.sub_events || null,
        // },
        cost: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        interested: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        attending: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        all_day: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        recurring: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        startTime: {
            type: DataTypes.Date,
            allowNull: false,
        },
        endtime: {
            type: DataTypes.Date,
            allowNull: false,
        },
        ownerID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'user',
                key: 'id',
            },
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.NOW,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.NOW,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        }
    });

    return Event;
};