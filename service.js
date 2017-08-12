'use strict';

const _ = require('lodash');
const Sequelize = require('sequelize');

// Modules
const logger = require('./modules/logger');
const webServer = require('./modules/webServer');

/**
 * Aim 2 Micro-service entry point
 * Author: Dave Richer
 */
class AimService {
    /**
     * Constructor
     */
    constructor(configurationObject) {
        // Set reasonable defaults
        const defaultConfig = {
            debug: {
                active: process.env.NODE_ENV === 'dev',
                environment: process.env.NODE_ENV,
                level: process.env.DEBUG_LEVEL || 'info'
            },
            webServer: {
                port: process.env.WEB_PORT || '1337',
            },
            database: {
                credentials: {
                    userName: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                },
                schemaName: process.env.DB_SCHEMA_NAME,
                host: process.env.DB_HOST || '127.0.0.1',
                dialect: process.env.DB_DIALECT || 'mysql',
                pool: {
                    max: 5,
                    min: 0,
                    idle: 10000,
                },
                // Sqlite Store only
                storage: process.env.DB_SQLITE_LOCATION || './database/db.sqlite'
            }
        };

        // Placeholders
        this._db = null;
        this._webServer = null;
        this._logger = null;

        // Override the defaults with what ever user defined variables passed into the constructor
        const finalConfig = _.isObject(configurationObject) ? configurationObject : Object.create({});
        this.config = _.defaultsDeep(defaultConfig, finalConfig);

        // Initialize
        this._init();
    };

    /**
     * Initialize the Server
     * @returns {Promise.<void>}
     * @private
     */
    async _init() {
        try {
            await this._initLogger();
            await this._initDb();
            await this._initWebServer();
        }
        catch(err) {
            console.dir(err)
            // Not Implemented
        }
    };


    /**
     * Initialize the Logger
     * @returns {Promise.<void>}
     * @private
     */
    async _initLogger() {
        this._logger = logger(this);
    }

    /**
     * Initialize the Web server
     * @returns {Promise.<void>}
     * @private
     */
    async _initWebServer() {
        const httpServices = webServer(this);
        this._webServer = httpServices.webServer;
        this._logger.info(`Listening for both HTTP on port ${this.config.webServer.port}`);
        this._logger.info(`Control-C to terminate`);
    };

    /**
     *
     * @returns {Promise}
     * @private
     */
    async _initDb() {
        try {
            // Create Database
            this._db = new Sequelize(
                this.config.database.schemaName,
                this.config.database.credentials.userName,
                this.config.database.credentials.password,
                _.without(this.config.database, 'credentials')
            );
            return this._db.authenticate();
        }
        catch (err) {
            // Not Implemented
        }
    };
}

module.exports = AimService; 