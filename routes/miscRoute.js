const _ = require('lodash');
const Router = require('express-promise-router');

const namespace = '/api/v1/';

// Middleware
const authMiddleware = require('../middleware/authMiddleware');
const multerMiddleware = require('../middleware/multerMiddlewareFactory');

// Response Errors
const ServerError = require('../responses/errors/serverError');

module.exports = (app) => {
    const uploadImage = async (req, res) => {
        try {
            res.json({
                success: true,
                payload: req.file,
            })
        } catch (err) {
            app.logger.error('Something went wrong inside the uploadImage', {
                message: err.message || '',
                stack: err.stack || '',
            });

            res.status(500).json(new ServerError());
        }
    };

    return {
        namespace,
        router: Router()
            .post(
                '/events/image-upload',
                authMiddleware,
                multerMiddleware('event-photos').single('eventImageFile'),
                uploadImage
            )
            .post(
                '/organizations/image-upload',
                authMiddleware,
                multerMiddleware('org-photos').single('orgImageFile'),
                uploadImage
            ),
    }
};
