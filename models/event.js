module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Event', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
        qeUrl:{
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
        ownerID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'user',
                key: 'id',
            },
        },
        category: {
            type: DataTypes.ENUM,
            values: ['CONCERTS', 'MOVIES', 'ARTS_AND_THEATER', 'EDUCATIONAL', 'HEALTH', 'SPORTS', 'SOCIALS'],
        },
        tag: {
            type: DataTypes.ENUM,
            values: ['ALL_AGES', '19+_SOCIAL'],
        },
        venueString: {
            type: DataTypes.STRING,
            allowNull: true,
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
        cost: {
            type: DataTypes.DOUBLE,
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
            type: DataTypes.ENUM,
            values: ['DAILY', 'EVERY_OTHER_DAY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'ANNUAL'],
        },
        recurringStartDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        recurringEndDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
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
    }, {
        tableName: 'event',
        freezeTableName: true,
        timestamps: true,
    });
};