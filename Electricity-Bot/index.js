'use strict';

const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const {Card, Suggestion } = require('dialogflow-fulfillment');
const axios = require('axios');

process.env.DEBUG = 'dialogflow:debug';
 exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

const disco_list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    function handleWelcome(agent) {
        const auth = {'name': 'auth', 'lifespan': 100, 'parameters': {}};
        agent.context.set(auth);
        agent.add(`Hi \nHope you are doing fine? \nI am Elc-Buddy your electricity payment guy. \nHere is a list of available DISCOs: 
        \n1. Abuja Distribution Company
        \n2. Enugu Distribution Company
        \n3. Kaduna Distribution Company
        \n4. Yola Distribution Company
        \n5. Jos Distribution Company
        \n6. Benin Distribution Company
        \n7. Eko Distribution Company
        \n8. Ibadan Distribution Company
        \n9. Port Harcourt Distribution Company
        \n10. Kano Distribution Company
        \n11. Ikeja Distribution Company
        \nSelect your DISCO option from the above`);
    }

    function handleDisco(agent) {
        const auth = agent.context.get('auth');
        const disco_number = auth.parameters.disco;
        if (disco.isInteger() > 0 && disco_list.includes(disco)) {          //To validate users input occurs within range
            agent.add(`How many unit of electricity do you want to buy?`);
        } else {
            agent.add(`Kindly enter any of listed number alongside the DISCOs`);
        }
    }

    function handlePowerUnit(agent) {
        const auth = agent.context.get('auth');
        const power_unit = auth.parameters.number;
        if (power_unit%100 === 0 && power_unit > 0) {           //Validate users input
            agent.add(`That is ${power_unit} unit of electricity from ${auth.parameters.disco}`);
        } else {
            agent.add(`Kindly enter a valid amount power unit e.g in multiples of 100s`);
        }
    }
    let intentMap = new Map();
    intentMap.set('welcome', handleWelcome);
    agent.handleRequest(intentMap);
 })  
