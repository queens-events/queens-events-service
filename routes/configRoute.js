const _ = require('lodash');
const request = require('request');
const Router = require('express-promise-router');

const namespace = '/';

const sendService = require('../services/senderService');

module.exports = (app) => {
    const { Event } = app.db;
    
    const sessions = {};

    const findOrCreateSession = (fbid) => {
        let sessionId;
        // Let's see if we already have a session for the user fbid
        Object.keys(sessions).forEach(k => {
            if (sessions[k].fbid === fbid) {
            // Yep, got it!
            sessionId = k;
            }
        });
        if (!sessionId) {
            // No session found for user fbid, let's create a new one
            sessionId = new Date().toISOString();
            sessions[sessionId] = {fbid: fbid, context: { _fbid_: fbid }};
        }
        return sessionId;
    };

    const processPostback = (event) => {
        var senderId = event.sender.id;
        var payload = event.postback.payload;
      
        if (payload === "Greeting") {
          // Get user's first name from the User Profile API
          // and include it in the greeting
            request({
                url: "https://graph.facebook.com/v2.6/" + senderId,
                qs: {
                    access_token: process.env.PAGE_ACCESS_TOKEN,
                    fields: "first_name"
                },
                method: "GET"
            }, (error, response, body) => {
                var greeting = "";
                if (error) {
                    console.log("Error getting user's name: " +  error);
                } 
                else {
                    var bodyObj = JSON.parse(body);
                    name = bodyObj.first_name;
                    greeting = "Hi " + name + ". ";
                }
                 
                let  message = greeting + "My name is STOMO. I can tell you various details regarding events managed by Queens Events! What events would you like to know about?";
                
                sendService.sendTextMessage(senderId, message);
                sendService.sendEventQuickReplies(senderId);
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
                if (messageText === 'soon') { 
                    const events = await Event.findAll({ limit: 5 });

                    await sendService.sendEventGenericMessage(sessions[sessionId].fbid, events);

                } else if (payload === 'concerts' || payload === 'movies' || payload === 'arts_and_theater'||
                    payload === 'education' || payload === 'health' || payload === 'sports') {

                    const events = await Event.findAll({ where: { category: payload.toUpperCase() }, limit: 5 });

                    await sendService.sendEventGenericMessage(sessions[sessionId].fbid, events);
                } else if (payload === 'adult_socials' || payload === 'all_ages_social') {
                    if (payload === 'adult_socials') {
                        payload = '19+_SOCIAL';
                    }

                    const events = await Event.findAll({ where: { tag: payload.toUpperCase() } });

                    await sendService.sendEventGenericMessage(sessions[sessionId].fbid, events);
                }
            } else {
                sendService.sendTextMessage(senderID, "I'm sorry, I don't understand english yet!");
            }

            sendService.sendEventQuickReplies(senderID);
        } catch (err) {
            app.logger.error('Something went wrong inside recievedMessage', {
                message: err.message || '',
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
      
    // All callbacks for Messenger will be POST-ed here
    const postWebhook = (req, res) => {
        // Make sure this is a page subscription
        let data = req.body;
        if (data.object === 'page') {
        // Iterate over each entry
        // There may be multiple entries if batched
      
        data.entry.forEach((entry) => {
            // Iterate over each messaging event
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