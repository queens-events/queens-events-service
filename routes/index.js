'use strict';

const fs = require('fs');

/**
 * Dynamically load all routes from routes directory
 * @param {QueensEventsService} app
 */
const routeLoader = app =>
    fs
        .readdirSync(__dirname)
        .forEach(file => {
            // The index file itself, or a non js file
            if (file === "index.js" || file.substr(file.lastIndexOf('.') + 1) !== 'js') return;

            /**
             * File name
             * @type {string}
             */
            const name = file.substr(0, file.indexOf('.'));

            // Require
            require('./' + name)(app);
        });

module.exports = routeLoader;