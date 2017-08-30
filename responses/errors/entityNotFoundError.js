const BaseError = require('./baseError');

/**
 * Error - entityNotFoundError
 */
class EntityNotFoundError extends BaseError {
    constructor(message) {
        super(message);
        this.message = message || 'Entity not found';
        this.code = 'entityNotFoundError';
    }
}

module.exports = EntityNotFoundError;