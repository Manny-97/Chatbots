'use strict';

const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const axios = require('axios');

process.env.DEBUG = 'dialogflow: debug';
    exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) =>{
        const agent = WebhookClient({request, response});
        console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
        console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    let intentMap = new Map();
    agent.handleRequest(intentMap);
    })