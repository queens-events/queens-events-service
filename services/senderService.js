const request = require('request');
const moment = require('moment');
const timeService = require('./timeService');

const sendService = {
	sendTextMessage(recipientId, messageText, quickReplies) {
		if (typeof quickReplies !== 'undefined') {
			quickReplies = quickReplies.map(function(x) {
				return {  title: x, content_type: "text", payload: "empty" }
			});
		}

		const messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messageText,
				quick_replies: quickReplies,
			}
		};

		return this.callSendAPI(messageData);
	},

	sendLocationPrompt(recipientId) {
		const messageData = {
			"recipient":{
			"id": recipientId
			},
			"message":{
				"text":"Please share your location:",
				"quick_replies":[{ "content_type":"location" }]
			}
		}
		this.callSendAPI(messageData);
	},

	sendEventQuickReplies(recipientId) {
		const choiceData = {
			"recipient":{
			"id": recipientId
			},
			"message":{
			"text":"Pick an event filter:",
			"quick_replies": [
				{
					"content_type":"text",
					"title":"Soon",
					"payload":"SOON",
					"image_url": "https://s3.ca-central-1.amazonaws.com/queens-events/icons/events_icon.png"
				},
				{
					"content_type":"text",
					"title":"Concerts",
					"payload":"CONCERTS",
					"image_url": "https://s3.ca-central-1.amazonaws.com/queens-events/icons/concert_icon.png"
				},
				{
					"content_type":"text",
					"title":"Movies",
					"payload":"MOVIES",
					"image_url": "https://s3.ca-central-1.amazonaws.com/queens-events/icons/movie_icon.png"
				},
				{
					"content_type":"text",
					"title":"19+ Socials",
					"payload":"19+_SOCIAL",
					"image_url": "https://s3.ca-central-1.amazonaws.com/queens-events/icons/19_social_icon.png"
				},
				{
					"content_type":"text",
					"title":"All Ages Socials",
					"payload":"ALL_AGES",
					"image_url": "https://s3.ca-central-1.amazonaws.com/queens-events/icons/child_icon.png"
				},
				{
					"content_type":"text",
					"title":"Arts",
					"payload":"ARTS_AND_THEATER",
					"image_url": "https://s3.ca-central-1.amazonaws.com/queens-events/icons/arts_icon.png"
				},
				{
					"content_type":"text",
					"title":"Educational",
					"payload":"EDUCATIONAL",
					"image_url": "https://s3.ca-central-1.amazonaws.com/queens-events/icons/edu_icon.png"
				},
				{
					"content_type":"text",
					"title":"Health",
					"payload":"HEALTH",
					"image_url": "https://s3.ca-central-1.amazonaws.com/queens-events/icons/health_icon.png"
				},
				{
					"content_type":"text",
					"title":"Sports",
					"payload":"SPORTS",
					"image_url": "https://s3.ca-central-1.amazonaws.com/queens-events/icons/sports_icon.png"
				}]
			}
		}
    	this.callSendAPI(choiceData);
  	},

	sendEventGenericMessage(recipientId, events) {
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "generic",
						elements: []
					}
				}
			}
		};

		Array.from(events).forEach((event) => {
			const buttons = [];

			const startTime = moment(event.startTime).subtract(4, 'hours').format('LLLL');
			const endTime = moment(event.endTime).subtract(4, 'hours').format('LT');

			const dateString = `${startTime} - ${endTime}`;

			buttons.push({
				type: 'web_url',
				url: event.itemUrl || event.fbEventUrl,
				title: 'Learn More',
			});
			
			if (event.ticketUrl) {
				buttons.push({type: 'web_url', url: 'event.ticketUrl', title: 'Buy Tickets'});
			}

			buttons.push({type: "element_share"})

			messageData.message.attachment.payload.elements.push(
			{
				title: event.name,
				subtitle: dateString,
				item_url: event.qeUrl || event.fbEventUrl || event.itemUrl,
				image_url: event.imageUrl,
				buttons
			});
		})
		console.log(messageData);
		return this.callSendAPI(messageData);
	},

	callSendAPI(messageData) {
		return new Promise((resolve, reject)=> {
			request({
				uri: 'https://graph.facebook.com/v2.9/me/messages',
				qs: { access_token: process.env.PAGE_ACCESS_TOKEN }, //'EAAbMvESBmPABAMr8alGszgzC3QdSA92SZA7A5fDUiZA7rG8pEEbaMO4vcxcOiNa3PZA3fSOt8tdA9yAFjOhQ8q97aZBLWbJ27dUhE7NYRGqO4ekOqZCTbHofC1IX6bp876r8LepxVQYeEOZAP166DLpyxQs66JqwKxcdpGaEBs3MPKFYRLxqxz' },
				method: 'POST',
				json: messageData
			}, function (error, response, body) {
				console.log(response);
				if (!error && response.statusCode == 200) {
					let recipientId = body.recipient_id;
					let messageId = body.message_id;

					console.log("Successfully sent generic message with id %s to recipient %s",
						messageId, recipientId);
					resolve(true);
				} else {
					console.log(error);
					reject(error);
				}
			});
		});
	}
}

module.exports = sendService;
