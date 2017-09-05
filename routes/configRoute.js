const _ = require('lodash');
const moment = require('moment');
const request = require('request-promise');
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

    const greetingMessage = async (senderID) => {
        const responseBody = await request({
            url: "https://graph.facebook.com/v2.6/" + senderID,
            qs: {
                access_token: process.env.PAGE_ACCESS_TOKEN,
                fields: "first_name"
            },
            method: "GET"
        });

        let bodyObj = JSON.parse(responseBody);
         
        let  message = `Hi ${bodyObj.first_name}. Choose a category to see upcoming events at Queen's and downtown Kingston`;
        
        await sendService.sendTextMessage(senderID, message);
        sendService.sendEventQuickReplies(senderID);
    }

    const processPostback = async (event) => {
        let senderID = event.sender.id;
        let payload = event.postback.payload;
      
        try {
            if (payload === "Greeting") {
                greetingMessage(senderID);
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

        try {
            const sessionId = findOrCreateSession(senderID);

            if (messageText.toUpperCase() === 'GET STARTED') {
                greetingMessage(senderID);
                return true;
            }
            else if (message.quick_reply.payload) {
                const payload = message.quick_reply.payload;
                if (payload === 'SOON') {
                    const events = await Event.findAll({
                        where: { startTime: { $gt: moment(timeOfMessage) }},
                        limit: 5
                    });

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
            }

            sendService.sendEventQuickReplies(senderID);
        } catch (error) {
            app.logger.error('Something went wrong inside recievedMessage', {
                message: error.message || '',
                stack: error.stack || '',
            });
        }
    };

    const root = async (req, res) => {
        res.send("Welcome to QueensEventsService!");
    };

    const privacy = (req, res) => {
        res.send(`Privacy Policy
        
        Queens Events provides this Privacy Policy to inform users of our policies and procedures regarding the collection, use and disclosure of personally identifiable information received from users of this website, located at https://queensevents.ca ("Site" ).
        
        By using our app you are consenting to our processing of your information as set forth in this Privacy Policy now and as amended by us. "Processing" means using cookies on a computer or using or touching information in any way, including, but not limited to, collecting, storing, deleting, using, and combining information, all of which activities will take place in the Canada.

        By visiting our Site and providing information to us, you consent to such transfer to, and processing in the Canada.`)
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
            .get('/privacy', privacy)
            .get('/webhook', getWebhook)
            .post('/webhook', postWebhook),
    }
}