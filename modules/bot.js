const Wit = require('node-wit').Wit;
const log = require('node-wit').log;
const senderService = require('../services/senderService');

const initBot = app => {
    const actions = {
        send({sessionId}, {text}) {
          const recipientId = sessions[sessionId].fbid;
          if (recipientId) {
            try {
                return senderService.sendTextMessage(recipientId, text);
            } catch (err) {
                app.logger.error(`Something went wrong forwarding the reponse to ${recipientId}`, {
                    message: err.message || '',
                    stack: err.stack || '',
                });
            }
          } else {
            console.error('Oops! Couldn\'t find user for session:', sessionId);
            // Giving the wheel back to our bot
            return Promise.resolve()
          }
        },
        getEvents({sessionId, context, entities}){
            context.events = app.db.Events.findAll({ limit: 5 });
            return context;
        },
    }
    
    const wit = new Wit({
        accessToken: process.env.WIT_TOKEN,
        actions,
        logger: new log.Logger(log.INFO)
    });

    return wit;
}

module.exports = initBot;