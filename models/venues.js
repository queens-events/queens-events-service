module.exports = (sequelize, DataTypes) => {
    const Venue = sequelize.define('Venue', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        orgOwnerID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'organization',
                key: 'id',
            },
        },
        title: {
            type: DataTypes.String,
            allowNull: false,
        },
        address: {
            type: DataTypes.String,
            allowNull: false,
        },
        city: {
            type: DataTypes.String,
            allowNull: false,
        },
        province: {
            type: DataTypes.String(2),
            allowNull: false,
        },
        country: {
            types: DataTypes.String(2),
            allowNull: false,
        },
        postal: {
            type: DataTypes.String(7),
            allowNull: false
        },
        lat: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        long: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        accessability: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
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
        }
    });

    return Venue
}