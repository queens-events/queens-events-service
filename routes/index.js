const _ = require('lodash');
const fs = require('fs');

/**
 * Dynamically load all routes from routes directory
 * @param {QueensEventsService} app
 */
const routeLoader = app =>
    fs
        .readdirSync(__dirname)
        .forEach((file) => {
            // The index file itself, or a non js file
            if (file === "index.js" || file.substr(file.lastIndexOf('.') + 1) !== 'js') return;

            /**
             * File name
             * @type {string}
             */
            const name = file.substr(0, file.indexOf('.'));

            // Require
            const route = require(`./${name}`)(app);

            if (
                !route ||
                !_.isString(route.namespace) ||
                _.isEmpty(route.namespace) ||
                !route.router
            ) {
                app.logger.error('Something went wrong loading a route file', {
                    route,
                });
                return;
            }
            app.webServer.use(route.namespace, route.router);
        });

module.exports = routeLoader;