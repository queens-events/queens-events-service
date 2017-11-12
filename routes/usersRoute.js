const _ = require('lodash');
const Router = require('express-promise-router');

const namespace = '/api/v1/users';

// Middleware
const authMiddleware = require('../middleware/authMiddleware');

// Response Errors
const ServerError = require('../responses/errors/serverError');
const EntityExistsError = require('../responses/errors/entityExistsError');
const EntityNotFoundError = require('../responses/errors/entityNotFoundError');
// const RequestValidationError = require('../responses/errors/requestValidationError');

module.exports = (app) => {
    const { Ability, User, Role, UserRole } = app.db;
    
    const getUsers = async (req, res) => {
        try {
            const user = await User.findAll();

            res.json({
                success: true,
                payload: user,
            });
        } catch (err) {
            app.logger.error('Something went wrong inside the getUsers', {
                message: err.message || '',
                stack: err.stack || '',
            });

            // Return Error Response
            res.status(500).json(new ServerError());
        }
    };

    const getUserByID = async (req, res) => {
        try {
            const user = await User.findOne({ where: { id: req.params.userID }});

            // user does not exist
            if (!user) {
                return res.json(new EntityNotFoundError());
            }

            res.json({
                success: true,
                payload: user,
            });
        } catch (err) {
            app.logger.error('Something went wrong inside the getUserByID', {
                message: err.message || '',
                stack: err.stack || '',
            });

            // Return Error Response
            res.status(500).json(new ServerError());
        }
    };

    const postUser = async (req, res) => {
        try {
            const user = await User.findOne({ where: { email: req.body.email }});

            if (user) {
                return res.json(new EntityExistsError());
            }

            const newUser = await User.create({
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                streetAddress: req.body.streetAddress || null,
                cityTown: req.body.cityTown || null,
                stateProvince: req.body.stateProvince || null,
                postalCode: req.body.postalCode || null,
                country: req.body.country || null,
                isActive: true,
            });

            //TODO
            //await assignRoles(req.body.Roles, newUser.get('id'));

            res.json({
                success: true,
                payload: newUser,
            });
        } catch (err) {
            app.logger.error('Something went wrong inside the postUser', {
                message: err.message || '',
                stack: err.stack || '',
            });

            // Return Error Response
            res.status(500).json(new ServerError());
        }
    };

    const updateUserByID = async (req, res) => {
        try {
            // Fetch User
            const user = await User.findOne({
                where: {
                    id: req.params.userID,
                },
            });

            // Entity does not exist
            if (!user) {
                return res.json(new EntityNotFoundError());
            }

            // Update user
            user.email = req.body.email;
            user.firstName = req.body.firstName;
            user.lastname = req.body.lastName;
            user.streetAddress = req.body.streetAddress;
            user.cityTown = req.body.cityTown;
            user.stateProvince = req.body.stateProvince;
            user.postalCode = req.body.postalCode;
            user.country = req.body.country;
            user.timezone = req.body.timezone;
            user.language = req.body.language;

            await user.save();

            res.json({
                success: true,
                payload: user,
            })
        } catch (err) {
            app.logger.error('Something went wrong inside the updateByUserID', {
                message: err.message || '',
                stack: err.stack || '',
            });

            // Return Error Response
            res.status(500).json(new ServerError());
        }
    };

    const deleteUserByID = async (req, res) => {
        try {
            const user = await User.findOne({ where: { id: req.params.userID }});

            await user.destroy();

            res.json({
                succes: true,
                payload: 'User was successfully deleted',
            })

        } catch (err) {
            app.logger.error('Something went wrong inside the deleteUserByID', {
                message: err.message || '',
                stack: err.stack || '',
            });

            // Return Error Response
            res.status(500).json(new ServerError());
        }
    };
    
    return {
        namespace,
        router: Router()
            .get('/', authMiddleware, getUsers)
            .post('/', authMiddleware, postUser)
            .get('/:userID', authMiddleware, getUserByID)
            .put('/:userID', authMiddleware, updateUserByID)
            .delete('/:userID', authMiddleware, deleteUserByID),
    }
};