const BaseError = require('./baseError');

/**
 * Error - server error
 */
class ServerError extends BaseError {
    constructor(message) {
        super(message);
        this.message = message || 'Server Error';
        this.code = 'serverError';
    }
}

module.exports = ServerError;