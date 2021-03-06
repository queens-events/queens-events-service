const _ = require('lodash');
const Router = require('express-promise-router');

const namespace = '/api/v1/events';

// Middleware
const authMiddleware = require('../middleware/authMiddleware');

// Response Errors
const ServerError = require('../responses/errors/serverError');
const EntityExistsError = require('../responses/errors/entityExistsError');
const EntityNotFoundError = require('../responses/errors/entityNotFoundError');
// const RequestValidationError = require('../responses/errors/requestValidationError');

module.exports = (app) => {
    const { Event } = app.db;
    
    const getEvents = async (req, res) => {
        try {
            const event = await Event.findAll();

            res.json({
                success: true,
                payload: event,
            });
        } catch (err) {
            app.logger.error('Something went wrong inside the getEvents', {
                message: err.message || '',
                stack: err.stack || '',
            });

            // Return Error Response
            res.status(500).json(new ServerError());
        }
    };

    const getEventByID = async (req, res) => {
        try {
            const event = await Event.findOne({ where: { id: req.params.eventID }});

            // event does not exist
            if (!event) {
                return res.json(new EntityNotFoundError());
            }

            res.json({
                success: true,
                payload: event,
            });
        } catch (err) {
            app.logger.error('Something went wrong inside the getEventByID', {
                message: err.message || '',
                stack: err.stack || '',
            });

            // Return Error Response
            res.status(500).json(new ServerError());
        }
    };

    const postEvent = async (req, res) => {
        try {
            const event = await Event.findOne({ where: { name: req.params.name }});

            if (event) {
                res.json(new EntityExistsError());
            }

            // console.log(req.data.body)

            const newEvent = await Event.create({
                name: req.body.name,
                imageUrl: req.body.imageUrl,
                description: req.body.description,
                address: req.body.address,
                category: req.body.category,
                tag: req.body.tag,
                city: req.body.city,
                province: req.body.province,
                country: req.body.country,
                postal: req.body.postal,
                lat: req.body.lat,
                long: req.body.long,
                accessability: req.body.accessability,
                startTime: req.body.startTime,
                endTime: req.body.endTime
            });

            console.log(newEvent)
            
            res.json({
                success: true,
                payload: newEvent,
            })
        } catch (err) {
            app.logger.error('Something went wrong inside the postEvent', {
                message: err.message || '',
                stack: err.stack || '',
            });

            // Return Error Response
            res.status(500).json(new ServerError());
        }
    };

    const updateEventByID = async (req, res) => {
        try {
            const event = await Event.findOne({ where: { id: req.params.eventID }});
            
            // event does not exist
            if (!event) {
                return res.json(new EntityNotFoundError());
            }

            res.json({
                success: true,
                payload: event,
            });
        } catch (err) {
            app.logger.error('Something went wrong inside the updateeventByID', {
                message: err.message || '',
                stack: err.stack || '',
            });

            // Return Error Response
            res.status(500).json(new ServerError());
        }
    };

    const deleteEventByID = async (req, res) => {
        try { 
            const event = await Event.findOne({ where: { id: req.params.eventID }});
            
            // event does not exist
            if (!event) {
                return res.json(new EntityNotFoundError());
            }

            res.json({
                success: true,
                payload: 'event was deleted successful',
            })
        } catch (err) {
            app.logger.error('Something went wrong inside the deleteeventByID', {
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
            .get('/', getEvents)
            .post('/', authMiddleware, postEvent)
            .get('/:eventID', authMiddleware, getEventByID)
            .put('/:eventID', authMiddleware, updateEventByID)
            .delete('/:eventID', authMiddleware, deleteEventByID),
    }
};