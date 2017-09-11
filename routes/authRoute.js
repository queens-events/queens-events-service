const _ = require('lodash');
const Router = require('express-promise-router');

const namespace = '/authenticate';

// Response Errors
const ServerError = require('../responses/errors/serverError');
const EntityExistsError = require('../responses/errors/entityExistsError');
const EntityNotFoundError = require('../responses/errors/entityNotFoundError');
// const RequestValidationError = require('../responses/errors/requestValidationError');

module.exports = (app) => {
    const { User } = app.db;

    const authenticate = async (res, req) => {
        try {
            const user = await User.findOne({ where: { id: req.params.userID }});

            // user does not exist
            if (!user) {
                return res.json(new EntityNotFoundError());
            }
            else if (user) {
                // check if password matches
                if (user.password != req.body.password) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                } else {
                    // if user is found and password is right
                    // create a token
                    const token = jwt.sign(user, app.get('superSecret'), {
                    expiresInMinutes: 1440 // expires in 24 hours
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        payload: token
                    });
                }
            }
        } catch (err) {
            app.logger.error('Something went wrong inside the getUserByID', {
                message: err.message || '',
                stack: err.stack || '',
            });

            // Return Error Response
            res.status(500).json(new ServerError());
        }
    }

    return {
        namespace,
        router: Router().post('/', authenticate),
    }
};