const _ = require('lodash');
const Router = require('express-promise-router');

const namespace = '/api/v1/venues';

// Response Errors
const ServerError = require('../responses/errors/serverError');
const EntityExistsError = require('../responses/errors/entityExistsError');
const EntityNotFoundError = require('../responses/errors/entityNotFoundError');
// const RequestValidationError = require('../responses/errors/requestValidationError');

module.exports = (app) => {
    const { Ability, User, Role, UserRole, Venue } = app.db;
    
    const getVenues = async (req, res) => {
        try {
            const venue = await Venue.findAll();

            res.json({
                success: true,
                payload: venue,
            });
        } catch (err) {
            app.logger.error('Something went wrong inside the getVenues', {
                message: err.message || '',
                stack: err.stack || '',
            });

            // Return Error Response
            res.status(500).json(new ServerError());
        }
    };

    const getVenueByID = async () => {
        try {
            const venue = await Venue.findOne({ where: { id: req.params.venueID }});

            // venue does not exist
            if (!venue) {
                return res.json(new EntityNotFoundError());
            }

            res.json({
                success: true,
                payload: venue,
            });
        } catch (err) {
            app.logger.error('Something went wrong inside the getVenueByID', {
                message: err.message || '',
                stack: err.stack || '',
            });

            // Return Error Response
            res.status(500).json(new ServerError());
        }
    };

    const postVenue = async () => {
        try {
            const venue = await Venue.findOne({ where: { id: req.params.venueID }});

            if (venue) {
                res.json(new EntityExistsError());
            }

            const newVenue = await Venue.create({
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
                payload: newVenue,
            })
        } catch (err) {
            app.logger.error('Something went wrong inside the postVenue', {
                message: err.message || '',
                stack: err.stack || '',
            });

            // Return Error Response
            res.status(500).json(new ServerError());
        }
    };

    const updateVenueByID = async () => {
        try {
            const venue = Venue.findOne({ where: { id: req.params.venueID }});
            
            // venue does not exist
            if (!venue) {
                return res.json(new EntityNotFoundError());
            }

            res.json({
                success: true,
                payload: 'Venue was updated successfully'
            });
        } catch (err) {
            app.logger.error('Something went wrong inside the updateVenueByID', {
                message: err.message || '',
                stack: err.stack || '',
            });

            // Return Error Response
            res.status(500).json(new ServerError());
        }
    };

    const deleteVenueByID = async (req, res) => {
        try { 
            const venue = Venue.findOne({ where: { id: req.params.venueID }});
            
            // venue does not exist
            if (!venue) {
                return res.json(new EntityNotFoundError());
            }

            res.json({
                success: true,
                payload: 'Venue was deleted successful',
            })
        } catch (err) {
            app.logger.error('Something went wrong inside the deleteVenueByID', {
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
            .get('/', getVenues)
            .post('/', postVenue)
            .get('/:venueID', getVenueByID)
            .put('/:venueID', updateVenueByID)
            .delete('/:venueID', deleteVenueByID),
    }
};