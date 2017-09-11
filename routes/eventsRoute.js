const _ = require('lodash');
const Router = require('express-promise-router');

const namespace = '/api/v1/events';

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
            const event = await Event.findOne({ where: { id: req.params.eventID }});

            if (event) {
                res.json(new EntityExistsError());
            }

            const newEvent = await Event.create({
                name: req.body.name,
                address: req.body.address,
                city: req.body.city,
                province: req.body.province,
                country: req.body.country,
                postal: req.body.postal,
                lat: req.body.lat,
                long: req.body.long,
                accessability: req.body.accessability,
            });
            
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
            .post('/', postEvent)
            .get('/:eventID', getEventByID)
            .put('/:eventID', updateEventByID)
            .delete('/:eventID', deleteEventByID),
    }
};