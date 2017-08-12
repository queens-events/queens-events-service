'use strict';

const Winston = require('winston');

/**
 * Logger Logic
 * @param app
 */
const initLogger = app => {
    const logger = app => new (Winston.Logger)({
        exitOnError: false,
        transports: [
            new (Winston.transports.DailyRotateFile)({
                name: 'info-file',
                filename: 'logs/info.log',
                level: 'info',
                prettyPrint: true,
                tailable: true,
                json: true,
                maxsize: 20000,
                zippedArchive: true,
            }),
            new (Winston.transports.DailyRotateFile)({
                name: 'error-file',
                filename: 'logs/error.log',
                level: 'warn',
                prettyPrint: true,
                tailable: true,
                json: true,
                maxsize: 20000,
                zippedArchive: true,
            })
        ],
        exceptionHandlers: [
            new Winston.transports.File({
                filename: 'logs/exceptions.log'
            })
        ]
    });

    if(app.config.debug.active) {
        logger.add(Winston.transports.Console, {
            name: 'console',
            timestamp: true,
            colorize: true,
            prettyPrint: true,
            depth: 4,
            level: app.config.debug.level || 'info',
        });
    }

    return logger;
}


module.exports = initLogger; 