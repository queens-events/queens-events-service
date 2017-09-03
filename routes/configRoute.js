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
        //const {text, attachments} = message;
        const sessionId = findOrCreateSession(senderID);
    
        if (messageText) {
            const payload = message.quick_reply.payload;
            // If we receive a text message, check to see if it matches a keyword
            // and send back the template example. Otherwise, just echo the text we received.
            if(messageText === 'Popular' || messageText === 'Close' || messageText === 'Soon') {
                filterChoice = messageText;
                sendService.sendLocationPrompt(sessions[sessionId].fbid);
                // We retrieve the user's current session, or create one if it doesn't exist
                // This is needed for our bot to figure out the conversation history
            } else if (payload === 'concerts' || payload === 'movies' ||
                payload === 'adult_socials' || payload === 'all_ages_socials' || payload === 'arts_and_theater'||
                payload === 'education' || payload === 'health' || payload === 'sports') {
    
                const events = await Event.findAll({ where: { category: payload.toUpperCase() }, limit: 5 });

                const result = await sendService.sendEventGenericMessage(sessions[sessionId].fbid, events);

                console.log("This is a result for generic messages", result);

                await sendService.sendEventQuickReplies(senderID);
            } 
            else if (messageAttachments) {
                if (messageAttachments[0].type === "location"){
                    //sendLocalEventFilterChoice(senderID);
                    let sortBy;
                    switch(filterChoice){
                    case 'Close':
                        sortBy = 'distance'
                        break;
                    case 'Soon':
                        sortBy = 'time'
                        break;
                    case 'Popular':
                        sortBy = 'popularity';
                        break;
                    default:
                        break;
                    }
                    let {lat, long} = messageAttachments[0].payload.coordinates
                    getLocalEvents(senderID, lat, long, sortBy, null); //senderID
                } 
                else {
                    sendService.sendTextMessage(senderID, "Message with attachment received");
                }
            }
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