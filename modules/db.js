const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const Sequelize = require('sequelize');

/**
 * Setup Database associations
 * @param {Object} db - Database Instance
 */
const setupRelations = (db) => {
    /**
     * Users
     */
    // A user belongs to many roles through UserRole
    db.User.belongsToMany(db.Role, {
        as: 'Roles',
        through: db.UserRole
    });

    // A role belongs to many users through UserRole
    db.Role.belongsToMany(db.User, {
        as: 'Users',
        through: db.UserRole
    });

    /**
     * Venues
     */
    

    /**
     * Organization
     */
    // A User can own one Organization
    db.User.hasOne(db.Organization, {
        foreignKey: 'ownerID',
        as: 'Organizations'
    })

    // An Organization belongs to a User
    db.Organization.belongsTo(db.User, {
        foreignKey: 'ownerID'
    });

    // An organization belongs to many UserRoles through OrganizatonUsers
    db.Organization.belongsToMany(db.UserRole, {
        as: 'UserRoles',
        through: db.OrganizationUser
    });

    // A UserRole belongs to many organization through OrganizationUsers
    db.UserRole.belongsToMany(db.Organization, {
        as: 'Organizations',
        through: db.OrganizationUser
    });

    /**
     * Events
     */
    // A User has one many events
    db.User.hasMany(db.Event, {
        foreignKey: 'ownerID',
        as: 'Users'
    });

    // An Event belongs to a single Owner (User)
    db.Event.belongsTo(db.User, {
        foreignKey: 'ownerID'
    });

    // An Organization has many Events
    db.Organization.hasMany(db.Event, {
        foreignKey: 'organizationID',
        as: 'Organizations'
    });

    // An Event belongs to only one Organization
    db.Event.belongsTo(db.Organization, {
        foreignKey: 'organizationID',
    });

    // A Venue has many Events
    db.Venue.hasMany(db.Event, {
        foreignKey: 'venueID',
        as: 'Venues'
    });

    // An Event belongs to only one Venue
    db.Event.belongsTo(db.Venue, {
        foreignKey: 'venueID',
    });
};

/**
 * Load in the Models Directory
 * @param {Object} db - Database Instance
 * @param {string} dirPath - Models Parent Directory
 */
const loadModels = (db, dirPath) => {
    fs
        .readdirSync(dirPath)
        .filter(file => (file.indexOf('.') !== 0) && (file.slice(-3) === '.js'))
        .forEach((file) => {
            const model = db.sequelize.import(path.join(dirPath, file));
            // Enforce reserved table names
            if (model.name === 'sequelize' || model.name === 'Sequelize') {
                throw new Error('The words sequelize (case insensitive) is reserved and cannot be used as a Model name');
            }

            // eslint-disable-next-line no-param-reassign
            db[model.name] = model;
        });

    Object.keys(db).forEach((modelName) => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });
};

/**
 * Initialize the Database
 * @param app
 * @returns {Promise.<void>}
 */
const initDb = async (app) => {
    const db = Object.create({});

    // Create Database
    const sequelize = new Sequelize(
        app.config.database.schemaName,
        app.config.database.credentials.userName,
        app.config.database.credentials.password,
        _.omit(app.config.database, 'credentials')
    );


    const dirPath = path.join(app.config.directory, 'models');

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    // Dynamically Read in Model
    loadModels(db, dirPath);

    setupRelations(db);

    // await db.Role.sync()
    // .then(() => {
    //     return Role.bulkCreate([
    //         {
    //             id: 1,
    //             name: 'superuser',
    //             createdAt: now,
    //             updatedAt: now,
    //         },
    //         {
    //             id: 2,
    //             name: 'user',
    //             createdAt: now,
    //             updatedAt: now,
    //         },
    //     ]);
    // });
    // await db.Ability.sync()
    // .then(() => {
    //     return Ability.bulkCreate([
    //         // Users
    //         {
    //             id: 1,
    //             name: 'createUsers',
    //         },
    //         {
    //             id: 2,
    //             name: 'viewUsers',
    //         },
    //         {
    //             id: 3,
    //             name: 'modifyUsers'
    //         },
    //         {
    //             id: 4,
    //             name: 'archiveUsers'
    //         },
    //         // Events
    //         {
    //             id: 5,
    //             name: 'createEvents',
    //         },
    //         {
    //             id: 6,
    //             name: 'viewEvents',
    //         },
    //         {
    //             id: 7,
    //             name: 'modifyEvents'
    //         },
    //         {
    //             id: 8,
    //             name: 'archiveEvents'
    //         },
    //         // Organizations
    //         {
    //             id: 9,
    //             name: 'createOrganizations'
    //         },
    //         {
    //             id: 10,
    //             name: 'viewOrganizations',
    //         },
    //         {
    //             id: 11,
    //             name: 'modifyOrganizations'
    //         },
    //         {
    //             id: 12,
    //             name: 'archiveOrganizations'
    //         },
    //         // Venues
    //         {
    //             id: 13,
    //             name: 'createVenues'
    //         },
    //         {
    //             id: 14,
    //             name: 'viewVenues'
    //         },
    //         {
    //             id: 15,
    //             name: 'modifyVenues'
    //         },
    //         {
    //             id: 16,
    //             name: 'archiveVenues'
    //         },
    //         // Profile
    //         {
    //             id: 17,
    //             name: 'modifyProfile'
    //         },
    //         // Analytics
    //         {
    //             id: 18,
    //             name: 'createAnalytics'
    //         },
    //         {
    //             id: 19,
    //             name: 'viewAnalytics'
    //         },
    //         {
    //             id: 20,
    //             name: 'modifyAnalytics'
    //         },
    //         {
    //             id: 21,
    //             name: 'archiveAnalytics'
    //         },
    //         // Notifications
    //         {
    //             id: 22,
    //             name: 'receiveEmailNotifications'
    //         },
    //     ]);
    // });

    return db;
};

module.exports = initDb;