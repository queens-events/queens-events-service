const bodyParser = require('body-parser');
const cors = require('cors');
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

    //if (app.config.debug.active === true) webServer.use(cors());
    webServer.use(cors());

    webServer.use(bodyParser.json())
             .use(bodyParser.urlencoded({ extended: true }));

    // Bind Express instance to HTTP Server
    const httpServer = http.createServer(webServer);

    // Bind HTTP Server
    httpServer.listen(app.config.webServer.port || 1337);

    return { webServer };
};

module.exports = initWebserver;