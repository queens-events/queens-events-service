class BaseError {
    constructor(message) {
        this.message = message;
        this.status = false;
    }
}

module.exports = BaseError;