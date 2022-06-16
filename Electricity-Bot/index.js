'use strict';

const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const {Card, Suggestion } = require('dialogflow-fulfillment');
const axios = require('axios');

process.env.DEBUG = 'dialogflow:debig';
 exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));


    function handleWelcome(agent) {
        agent.add(`Hi \nHope you are doing fine? \nI am Elc-Buddy your electricity payment guy. \nHere is a list of available DISCOs: 
        \n1 Abuja Distribution Company
        \n2 Enugu Distribution Company
        \n3 Kaduna Distribution Company
        \n4 Yola Distribution Company
        \n5 Jos Distribution Company
        \n6 Benin Distribution Company
        \n7 Eko Distribution Company
        \n8 Ibadan Distribution Company
        \n9 Port Harcourt Distribution Company
        \n10 Kano Distribution Company
        \n11 Ikeja Distribution Company
        \nSelect your DISCO option from the above`)
    }
    let intentMap = new Map();
    intentMap.set('welcome', handleWelcome);
    agent.handleRequest(intentMap);
 })  
