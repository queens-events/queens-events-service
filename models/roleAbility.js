module.exports = (sequelize, DataTypes) => {
    return sequelize.define('RoleAbility', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'role',
                key: 'id',
            },
        },
        abilityId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'ability',
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
        tableName: 'roleAbility',
        freezeTableName: true,
        timestamps: true,
    });
};