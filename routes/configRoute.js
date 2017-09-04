const _ = require('lodash');
const moment = require('moment');
const request = require('request-promise');
const axios = require('axios');
const querystring = require('querystring');
const Router = require('express-promise-router');

const namespace = '/';

const sendService = require('../services/senderService');

module.exports = (app) => {
    const { Event } = app.db;
    
    const sessions = {};

    const findOrCreateSession = (fbid) => {
        let sessionId;
        Object.keys(sessions).forEach(k => {
            if (sessions[k].fbid === fbid) {
                sessionId = k;
            }
        });
        if (!sessionId) {
            sessionId = new Date().toISOString();
            sessions[sessionId] = {fbid: fbid, context: { _fbid_: fbid }};
        }
        return sessionId;
    };

    const processPostback = async (event) => {
        var senderId = event.sender.id;
        var payload = event.postback.payload;
      
        try {
            if (payload === "Greeting") {
                const responseBody = await request({
                    url: "https://graph.facebook.com/v2.6/" + senderId,
                    qs: {
                        access_token: process.env.PAGE_ACCESS_TOKEN,
                        fields: "first_name"
                    },
                    method: "GET"
                });
    
                let greeting = "";

                let bodyObj = JSON.parse(responseBody);
                name = bodyObj.first_name;
                greeting = "Hi " + name + ". ";
                 
                let  message = greeting + "My name is STOMO. I can tell you various details regarding events managed by Queens Events! What events would you like to know about?";
                
                await sendService.sendTextMessage(senderId, message);
                sendService.sendEventQuickReplies(senderId);
            }
        } catch (err) {
            app.logger.error('Something went wrong inside recievedMessage', {
                message: err.message || '',
                stack: err.stack || '',
            });
        }
    };

    const receivedMessage = async (event) => {
        let senderID = event.sender.id;
        let recipientID = event.recipient.id;
        let timeOfMessage = event.timestamp;
        let message = event.message;
    
        console.log("Received message for user %d and page %d at %d with message:",
            senderID, recipientID, timeOfMessage);
        console.log(JSON.stringify(message));
    
        let messageId = message.mid;
        let messageText = message.text;
        let messageAttachments = message.attachments;

        const payload = message.quick_reply.payload;

        try {
            const sessionId = findOrCreateSession(senderID);
            if (payload) {
                if (messageText === 'SOON') {
                    const events = await Event.findAll({
                        startTime: { $gt: moment(timeOfMessage) },
                        limit: 5
                    });

                    console.log(events);

                    await sendService.sendEventGenericMessage(sessions[sessionId].fbid, events);

                } else if (payload === 'CONCERTS' || payload === 'MOVIES' || payload === 'ARTS_AND_THEATER' ||
                    payload === 'EDUCATIONAL' || payload === 'HEALTH' || payload === 'SPORTS') {

                    const events = await Event.findAll({
                        where: { category: payload, startTime: { $gt: moment(timeOfMessage) }},
                        limit: 5
                    });

                    await sendService.sendEventGenericMessage(sessions[sessionId].fbid, events);
                } else if (payload === '19+_SOCIAL' || payload === 'ALL_AGES') {
                    const events = await Event.findAll({ 
                        where: { tag: payload, startTime: { $gt: moment(timeOfMessage) }},
                        limit: 5
                    });

                    await sendService.sendEventGenericMessage(sessions[sessionId].fbid, events);
                }
            } else {
                sendService.sendTextMessage(senderID, "I'm sorry, I don't understand english yet!");
            }

            sendService.sendEventQuickReplies(senderID);
        } catch (error) {
            app.logger.error('Something went wrong inside recievedMessage', {
                message: err || '',
                stack: err.stack || '',
            });
        }
    };

    const root = async (req, res) => {
        res.send("Welcome to QueensEventsService!");
    };
      
    // Facebook Webhook
    const getWebhook = (req, res) => {
        console.log('This is getting called!');
        if (req.query["hub.verify_token"] === process.env.VERIFICATION_TOKEN) {
            app.logger.info("Verified webhook");
            
            res.status(200).send(req.query["hub.challenge"]);
        } else {
            app.logger.error("Verification failed. The tokens do not match.");

            res.sendStatus(403);
        }
    };
    
    // All callbacks come here
    const postWebhook = (req, res) => {
        let data = req.body;
        if (data.object === 'page') {
      
        data.entry.forEach((entry) => {
            let pageID = entry.id;
            let timeofEvent = entry.time;
      
            entry.messaging.forEach((event) => {
                if (event.postback) {
                    processPostback(event);
                } else if(event.message) {
                    receivedMessage(event);
                } else {
                    console.log("Webhook received unknown event: ", event);
                }
            });
        });
      
          res.sendStatus(200);
        }
    };

    return {
        namespace,
        router: Router()
            .get('/', root)
            .get('/webhook', getWebhook)
            .post('/webhook', postWebhook),
    }
}