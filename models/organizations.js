module.exports = (sequelize, DataTypes) => {
    const Organization = sequelize.define('Organization', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ownerID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'venue',
                key: 'id',
            },
        },
        title: {
            type: DataTypes.String,
            allowNull: false,
        },
        description: {
            type: DataTypes.String,
            allowNull: true,
        },
        websiteUrl: {
            type: DataTypes.String,
            allowNull: true,
        },
        fbPageUrl: {
            type: DataTypes.String,
            allowNull: true,
        },
        phone: {
            type: DataTypes.String,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: sequelize.NOW,
            allowNull: false,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: sequelize.NOW,
            allowNull: false,
        },
    });

    return Organization
}