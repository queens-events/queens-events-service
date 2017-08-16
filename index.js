'use strict';

const currentEnv = process.env.NODE_ENV;

if(currentEnv) require('dotenv').config();

else require('dotenv').config();

const QueensEventsService = require('./service');

const main = async () => {
    try {
        const service = new QueensEventsService();
    }
    catch(err) {
        console.error('A unhandled fatal error has occurred');
        console.dir({
            message: err.message || '',
            stack: err.stack || '',
        });
        process.exit(1);
    }
};

main();
