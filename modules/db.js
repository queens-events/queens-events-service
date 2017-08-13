'use strict';

const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const Sequelize = require('sequelize-cockroachdb');

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

    fs
        .readdirSync(dirPath)
        .filter(function (file) {
            return (file.indexOf('.') !== 0)  && (file.slice(-3) === '.js');
        })
        .forEach(function (file) {
            const model = sequelize['import'](path.join(dirPath, file));
            db[model.name] = model;
        });

    Object.keys(db).forEach(function (modelName) {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
    return db;
};

module.exports = initDb;