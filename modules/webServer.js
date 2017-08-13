'use strict';
const Express = require('express');
const http = require('http');

/**
 * Encapsulate the HTTP Logic
 * Includes Socket.IO and HTTP
 * @param app
 * @returns {{webServer: (*|Function)}}
 */
const initWebserver = app => {
    // Create Express instance
    const webServer = Express();

    // Bind Express instance to HTTP Server
    const httpServer = http.createServer(webServer);

    // Bind HTTP Server
    httpServer.listen(app.config.webServer.port || 1337);

    return {webServer};
};

module.exports = initWebserver;