'use strict';

const currentEnv = process.env.NODE_ENV;

if(currentEnv) require('dotenv').config();

else require('dotenv').config();

const QueensEventsService = require('./service');

try {
    const service = new QueensEventsService();
}
catch(err) {
    console.dir(err);
}