module.exports = (sequelize, DataTypes) => {
    return sequelize.define('OrganizationUser', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        organizationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'organization',
                key: 'id',
            },
        },
        userRoleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'userRole',
                key: 'id',
            },
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'organizationUser',
        freezeTableName: true,
        timestamps: true,
    });
};