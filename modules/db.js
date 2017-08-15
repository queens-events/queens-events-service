'use strict';

const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const Sequelize = require('sequelize-cockroachdb');

/**
 * Setup Database associations
 * @param {Object} db - Database Instance
 */
// const setupRelations = (db) => {

// };

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

    db.User.sync({force: true});

    return db;
};

module.exports = initDb;