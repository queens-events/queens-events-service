'use strict';

const currentEnv = process.env.NODE_ENV;

if(currentEnv) require('dotenv').config();

else require('dotenv').config();

const AimService = require('./service');

try {
    const service = new AimService();
}
catch(err) {
    console.dir(err);
}