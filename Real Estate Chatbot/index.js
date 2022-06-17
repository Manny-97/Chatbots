'use strict';
const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const axios = require('axios');

process.env.DEBUG = "dialogflow: debug";
    exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
        console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
        console.log('Dialogflow Request body: ' + JSON.stringify(request.body));



    function handleWelcome(agent) {
        agent.add(`Hi \nIam Zack, your best buddy when it comes to all info regarding house.
        \nEnter *Menu* to see the amazing options of your house fulfillment`);
    }
    function menu(agent) {
        agent.add(`Which of these are you interested in? 
        \n1.
        \n2.
        \n3.
        \n4.
        \n5.
        \n6.
        \n7.
        \nOoops! you cannot find what you are looking for here? You can tell me.`);
    }
    function handleFallback(agent) {
        agent.add(`I did not get that, can you type in the message before this?`);
    }

    let intentMap = new Map();
    agent.handleRequest(intentMap);
    })