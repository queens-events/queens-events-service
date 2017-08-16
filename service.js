'use strict';

const _ = require('lodash');
const Sequelize = require('sequelize-cockroachdb');

// Modules
const db = require('./modules/db');
const logger = require('./modules/logger');
const webServer = require('./modules/webServer');

/** Queens Events Micro Service
 * Queens Events Micro-service entry point
 * Author: Stephen Peterkins
 */
class QueensEventsService {
    /**
     * Constructor
     */
    constructor(configurationObject) {
        // Set reasonable defaults
        const defaultConfig = require('./config.js');

        // Placeholders
        this._db = null;
        this._webServer = null;
        this._logger = null;

        // Override the defaults with what ever user defined variables passed into the constructor
        const finalConfig = _.isObject(configurationObject) ? configurationObject : Object.create({});
        this.config = _.defaultsDeep(defaultConfig, finalConfig);

        // Initialize
        this.init();
    };

    /**
     * Initialize the Server
     * @returns {Promise.<void>}
     * @private
     */
    async init() {
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
        try {
            this._logger = logger(this);
        }
        catch (err) {
            this._logError('Something went wrong setting up the logger', err);
        }
    }

    /**
     * Initialize the Web server
     * @returns {Promise.<void>}
     * @private
     */
    async _initWebServer() {
        const httpServices = webServer(this);
        this._webServer = httpServices.webServer;

        // Load Routes
        require('./routes')(this);

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
            this._db = await db(this);
            return this._db.sequelize.authenticate();
        }
        catch (err) {
            this._logError('Something went wrong setting up the Database', err);
        }
    };

    /**
    * Log an error through the logging transport
    * @param {string} message
    * @param {Error} err
    */
    _logError(message, err) {
        this._logger.error(message, {
            message: err.message || '',
            stack: err.stack || '',
        });
    }
}

module.exports = QueensEventsService; 