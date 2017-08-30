const BaseError = require('./baseError');

/**
 * Error - entityExistsError
 */
class EntityExistsError extends BaseError {
    constructor(message) {
        super(message);
        this.message = message || 'Entity already exists';
        this.code = 'entityExistsError';

    }
}

module.exports = EntityExistsError;