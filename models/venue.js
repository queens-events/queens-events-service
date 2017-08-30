module.exports = (sequelize, DataTypes) => {
   return sequelize.define('Venue', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        province: {
            type: DataTypes.STRING(2),
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING(2),
            allowNull: false,
        },
        postal: {
            type: DataTypes.STRING(7),
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
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        }
     }, {
        tableName: 'venue',
        freezeTableName: true,
        timestamps: true,
    });
}