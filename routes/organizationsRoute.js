const _ = require('lodash');
const Router = require('express-promise-router');

const namespace = '/api/v1/organizations';

// Response Errors
const ServerError = require('../responses/errors/serverError');
const EntityExistsError = require('../responses/errors/entityExistsError');
const EntityNotFoundError = require('../responses/errors/entityNotFoundError');
// const RequestValidationError = require('../responses/errors/requestValidationError');

module.exports = (app) => {
    const { Ability, User, Role, UserRole, Organization } = app.db;
    
    const getOrganizations = async (req, res) => {
        try {
            const organization = await Organization.findAll();

            res.json({
                success: true,
                payload: organization,
            });
        } catch (err) {
            app.logger.error('Something went wrong inside the getOrganizations', {
                message: err.message || '',
                stack: err.stack || '',
            });

            // Return Error Response
            res.status(500).json(new ServerError());
        }
    };

    const getOrganizationByID = async () => {
        try {
            const organization = await Organization.findOne({ where: { id: req.params.organizationID }});

            // organization does not exist
            if (!organization) {
                return res.json(new EntityNotFoundError());
            }

            res.json({
                success: true,
                payload: organization,
            });
        } catch (err) {
            app.logger.error('Something went wrong inside the getOrganizationByID', {
                message: err.message || '',
                stack: err.stack || '',
            });

            // Return Error Response
            res.status(500).json(new ServerError());
        }
    };

    const postOrganization = async () => {
        try {
            const organization = await Organization.findOne({ where: { id: req.params.organizationID }});

            if (organization) {
                res.json(new EntityExistsError());
            }

            const newOrganization = await organization.create({
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
                payload: newOrganization,
            })
        } catch (err) {
            app.logger.error('Something went wrong inside the postorganization', {
                message: err.message || '',
                stack: err.stack || '',
            });

            // Return Error Response
            res.status(500).json(new ServerError());
        }
    };

    const updateOrganizationByID = async () => {
        try {
            const organization = await Organization.findOne({ where: { id: req.params.organizationID }});
            
            // organization does not exist
            if (!organization) {
                return res.json(new EntityNotFoundError());
            }

            res.json({
                success: true,
                payload: organization,
            });
        } catch (err) {
            app.logger.error('Something went wrong inside the updateorganizationByID', {
                message: err.message || '',
                stack: err.stack || '',
            });

            // Return Error Response
            res.status(500).json(new ServerError());
        }
    };

    const deleteOrganizationByID = async (req, res) => {
        try { 
            const organization = await Organization.findOne({ where: { id: req.params.organizationID }});
            
            // organization does not exist
            if (!organization) {
                return res.json(new EntityNotFoundError());
            }

            res.json({
                success: true,
                payload: 'organization was deleted successful',
            })
        } catch (err) {
            app.logger.error('Something went wrong inside the deleteorganizationByID', {
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
            .get('/', getOrganizations)
            .post('/', postOrganization)
            .get('/:organizationID', getOrganizationByID)
            .put('/:organizationID', updateOrganizationByID)
            .delete('/:organizationID', deleteOrganizationByID),
    }
};