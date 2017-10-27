const _ = require('lodash');
const jwt = require('jsonwebtoken')
const Router = require('express-promise-router');

const namespace = '/authenticate';

// Response Errors
const ServerError = require('../responses/errors/serverError');
const EntityExistsError = require('../responses/errors/entityExistsError');
const EntityNotFoundError = require('../responses/errors/entityNotFoundError');
// const RequestValidationError = require('../responses/errors/requestValidationError');

module.exports = (app) => {
    const { User } = app.db;

    const authenticate = async (req, res) => {
        try {
            const user = await User.findOne({ where: { email: req.body.email }});

            if (!user) {
                return res.json(new EntityNotFoundError());
            }

            else if (user) {
                if (user.password != req.body.password) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                } else {
                    const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
                        expiresIn:  process.env.JWT_EXPIRE
                    });

                    res.json({
                        success: true,
                        payload: token
                    });
                }
            }
        } catch (err) {
            app.logger.error('Something went wrong inside authenticate', {
                message: err.message || '',
                stack: err.stack || '',
            });

            res.status(500).json(new ServerError());
        }
    };

    const signUp = async (req, res) => {
        try {
            const user = await User.findOne({ where: { email: req.body.email }});

            if (user) {
                return res.json(new EntityExistsError());
            }

            const newUser = await User.create({
                email: req.body.email,
                password: req.body.password
            });

            const token = jwt.sign(newUser.toJSON(), process.env.JWT_SECRET, {
                expiresIn:  process.env.JWT_EXPIRE
            });

            res.json({
                success: true,
                payload: { newUser, token }
            });
        } catch (err) {
            app.logger.error('Something went wrong inside the signUp in authRoutes', {
                message: err.message || '',
                stack: err.stack || '',
            });

            res.status(500).json(new ServerError());
        }
    };

    return {
        namespace,
        router: Router()
            .post('/', authenticate)
            .post('/signUp', signUp),
    }
}