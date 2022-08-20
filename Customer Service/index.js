// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {Carousel,DialogflowConversation,SimpleResponse} = require('actions-on-google');
const { Payload } = require("dialogflow-fulfillment");
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const axios = require('axios');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  const store = [
    "default", 
    "agemawo",
    "cow tail",
    "boneless beek",
    "boneless beef",
    "boneless beef mini",
    "beef with bone",
    "cow head",
    "cow hump",
    "assorted",
    "cow liver",
    "cow intestine",
    "shaki",
    "cow leg",
    "minced meat", 
    "cow heart", 
    "cow kidney",
    "ponmo",
    "cow lungs",
    "goat meat", 
    "goat assorted",
    "goat head and leg",
    "chicken",
    "chicken wings",
    "chicken lap",
    "agemawo 1kg",
    "agemawo token",
    "shaki and roundabout",
    "tail token",
    "head & neck token",
    "cow hump token",
    "test ponmo",
    "cow tongue",
    "value pack hake",
    "token hake",
    "value pack titus",
    "gizzard",
    "token panla",
  ],
  store1 = ['default', 'boneless beef', 'agemawo'],     
  Chicken = ['chicken', 'gizzard', 'chicken lap', "chicken wings", 'chicken token'],
  Fish = ["token hake", "value pack titus", "value pack hake", "token panla"],
  Goat =['goat meat', 'goat head and leg', 'goat assorted', 'goat meat token'];
 
  const substitute = [];
  const prod_link = "base_url";
  const web_prod_link = "";
  const token = 'token';
  const delivery_method_list = ['none', 'delivery', 'pickup'];
  const payment_method_list = ['None', 'cash', 'bank'];
  
  
  function handleWelcome(agent) {
  const auth = agent.context.get('auth');
  const name = auth.parameters.name;
  const phone = auth.parameters.phonenumber;
   if ((/^[0]\d{10}$/).test(phone) && agent.context.get('auth')) {
    return axios.get(`${prod_link}/customers/${phone}`,{ headers : {"Authorization": `Token ${token}`
    }}).then((res) => { 
    const auth = {'name': 'auth', 'lifespan': 100, 'parameters': {}};
     auth.parameters.phonenumber = phone;
     auth.parameters.name = res.data.data.name;
     auth.parameters.customer = res.data.data.id;
     auth.parameters.address =  res.data.data.address;
     auth.parameters.fulfilment_center = res.data.data.fulfilment_center; 
     agent.context.set(auth);
     agent.add(`Hi ${capitalizeFirstLetter(auth.parameters.name)}, 👋 Welcome to SendMe store \nDo you want to use this delivery address: \n${auth.parameters.address} \nReply with either 𝘆𝗲𝘀 or 𝗻𝗼.`);
     //agent.add(new Suggestion(`yes`));
     //agent.add(new Suggestion(`no`));
     agent.end(""); 
      
    }).catch((err) => {
     if(err.response.status == 404) {
       agent.add(`Where are you located? Ibadan or Abeokuta?`);
      //agent.add(`Kindly register your delivery address on this website, ${web_prod_link}/?phoneNumber=${phone}&name=${name.name.replace(" ", "%20")}`);
     }else {
     agent.add("An error has just occurred while saving your details.");
     agent.end("");}
   });
} else {
  agent.add(`Hi, welcome to the ZEN bot, reply with your name and valid phone number \ne.g. Shade Adefemi, 08212324456`);
}
}

  function viewAdress(agent) {
      const auth = agent.context.get('auth');
      const number = agent.context.get('auth');
      const address = agent.context.get('auth');
      if (agent.context.get('auth')) {
        agent.add(`Hi ${capitalizeFirstLetter(auth.parameters.name)}, 👋 \nDo you want to use this delivery address: \n${auth.parameters.address} \nReply with either 𝐲𝐞𝐬 or 𝐧𝐨.`);
        //agent.add(new Suggestion(`yes`));
        //agent.add(new Suggestion(`no`));
    } else {
      agent.add(`Hi, welcome to the ZEN bot, reply with your name and valid phone number \ne.g. Shade Adefemi, 08212324456`);
    }
  }
  function setDeliveryAddress(agent) {
  	const auth = agent.context.get("auth"); 
  	const phoneNumber = auth.parameters.phonenumber;//`07062861786`;
  	agent.add(`Do you want to use this address: \n`);
  	return axios.get(`${prod_link}/customers/${phoneNumber}/`, {"headers": {
    	"Authorization": `Token ${token}`
  	}})
  	.then((res) => {
    agent.add(`${res.data.data.address} \nReply with either *yes* or *no*.`, new Suggestion(`yes`), new Suggestion(`no`));
    //agent.add(new Suggestion(`yes`));
    //agent.add(new Suggestion(`no`));
  })
  .catch((err) => agent.add(err.message));
 }
  
  function changeAddress(agent) {
  const auth = agent.context.get("auth");
  const phoneNumber = auth.parameters.phonenumber;
  const response = {
  "richContent": [
    [
      {
        "type": "info",
        "title": "Change Address",
        "actionLink": "${web_prod_link}/?phoneNumber=${phoneNumber}&existing_customer=true"
      }
    ]
  ]
};

  agent.add(`Where are you located? Ibadan or Abeokuta?`);
  //agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
  }
  
  function catalogue(agent) {
  	const response = {
  "richContent": [
    [
      {
        "image": {
          "src": {
            "rawUrl": "https://dl.dropbox.com/s/wgx869ipwf59a16/beef_with_skin.JPG?dl=0"
          }
        },
        "title": "Agemawo",
        "actionLink": "https://dl.dropbox.com/s/wgx869ipwf59a16/beef_with_skin.JPG?dl=0",
        "type": "info"
      },
      {
        "type": "divider"
      },
      {
        "image": {
          "src": {
            "rawUrl": "https://dl.dropbox.com/s/25457i1umwaobnx/beef_without_bone.JPG?dl=0"
          }
        },
        "title": "Boneless Beef",
        "actionLink": "https://dl.dropbox.com/s/25457i1umwaobnx/beef_without_bone.JPG?dl=0",
        "type": "info"
      },
      {
        "type": "divider"
      },
      {
        "image": {
          "src": {
            "rawUrl": "https://dl.dropbox.com/s/z7aa2jsebcweh60/assorted_meat.JPG?dl=0"
          }
        },
        "title": "Assorted Meat",
        "actionLink": "https://dl.dropbox.com/s/z7aa2jsebcweh60/assorted_meat.JPG?dl=0",
        "type": "info"
      },
      {
        "type": "divider"
      },
      {
        "image": {
          "src": {
            "rawUrl": "https://drive.google.com/file/d/1jei51YuiaHIn-UFksjmuQtS_nDFfgSFK/view?usp=sharing"
          }
        },
        "title": "Minced Meat",
        "actionLink": "https://drive.google.com/file/d/1jei51YuiaHIn-UFksjmuQtS_nDFfgSFK/view?usp=sharing",
        "type": "info"
      },
      {
        "type": "divider"
      },
      {
        "image": {
          "src": {
            "rawUrl": "https://dl.dropbox.com/s/3rbsce7aon9vr84/goat_meat.JPG?dl=0"
          }
        },
        "title": "Goat Meat",
        "actionLink": "https://dl.dropbox.com/s/3rbsce7aon9vr84/goat_meat.JPG?dl=0",
        "type": "info"
      },
      {
        "type": "divider"
      },
      {
        "image": {
          "src": {
            "rawUrl": "https://dl.dropbox.com/s/uo03vpr2eklnri6/bone_chop.JPG?dl=0"
          }
        },
        "title": "Beef with bone",
        "actionLink": "https://dl.dropbox.com/s/uo03vpr2eklnri6/bone_chop.JPG?dl=0",
        "type": "info"
      }
    ]
  ]
};

  //agent.add(`Follow the link below to change your delivery address: \n${web_prod_link}/?phoneNumber=${phoneNumber}&existing_customer=true`);
  agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));

  }
  function getContext(name){
    const contexts = request.body.queryResult.outputContexts;
    for(let context of contexts.filter(p => p.name)) {
        const splitName = context.name.split('/');
    	const contextName = splitName[splitName.length - 1];
      	if(contextName === name) {
            return context;
        }
    }
    return undefined;
}
  
  function showStore(agent) {
    var answer = "This is what we have available: \n";
    
    if (agent.context.get('auth')) {
         const auth = agent.context.get('auth');
         const fufilment_center = auth.parameters.fulfilment_center;
      return axios
    .get(`${prod_link}/stocks/items/?fulfilment_center=${fufilment_center}`, {"headers": {
      "Authorization": `Token ${token}`
    }})
    .then((res) => {
      
      for (let i = 0; i < res.data.data.length; i++) {
        let element = res.data.data[i];
        if (element.pu_quantity != 0) {
        //res.data.data.slice(0, res.data.length).map((data, i) => {
          answer +=`❖${element.bundle_product} ₦${element.price}/pack` + " \n ";
        //});
        
        
        }
      else {
          continue;
        }
    } if (answer != "This is what we have available: \n") {
      agent.add(answer + `To order from the store, reply with your order and quantity e.g 𝟓 𝐩𝐚𝐜𝐤𝐬 𝐨𝐟 𝐩𝐨𝐧𝐦𝐨.?`);
    } else {agent.add(`There is nothing in the store`);}
    })
    .catch((err) => {if (err.response.status ===400) {
        agent.add(`Hi, welcome, reply with your name and valid phone number \ne.g. Shade Adefemi, 08212324456`);
      }else {agent.add(err.message);}});
    }else {
    agent.add("Kindly reply with your full name and phone number to get access to the store \ne.g. Shade Adefemi, 08212324456"); 
    }
  }
  
  function menu(agent) {
    const auth = agent.context.get('auth');
    if (agent.context.get('auth')) {
       agent.add(`This is what we have available: \nA. Cow 🐄 \nB. Goat 🐐 \nC. Chicken 🐓 \nD. Fish 🐟\nEnter any of the options to see products under it.`);
     }else{
     agent.add("Kindly reply with your full name and phone number to get access to the store \ne.g. Shade Adefemi, 08212324456");
     }
  }
  
  function cow(agent) {
    const auth = agent.context.get("auth");
    const fufilment_center = auth.parameters.fulfilment_center;
    var answer = `𝐁𝐞𝐞𝐟: \n`;
    return axios
      .get(`${prod_link}/stocks/items/?fulfilment_center=${fufilment_center}`, {"headers": {
        "Authorization": `Token ${token}`
      }})
      .then((res) => {
        for (let i=0; i < res.data.data.length; i++) {
          const element = res.data.data[i];
          if (!Goat.includes(element.bundle_product.toLowerCase()) && !Chicken.includes(element.bundle_product.toLowerCase()) && !Fish.includes(element.bundle_product.toLowerCase())) {
          if (element.pu_quantity != 0) {
          answer +=`❖${element.bundle_product} ₦${element.price}/pack` + `\n`;
          }
      }
      else {
          continue;
        }
        
      } if (answer != "𝐁𝐞𝐞𝐟: \n") {
        agent.add(answer + `𝐖𝐡𝐚𝐭 𝐰𝐨𝐮𝐥𝐝 𝐲𝐨𝐮 𝐥𝐢𝐤𝐞 𝐭𝐨 𝐨𝐫𝐝𝐞𝐫?`);
      }else {
      agent.add(`There is no Beef product in Store`);}
      })
      .catch((err) => agent.add(`An error occurred ${err.message}`));
      }
  
  function submenu(agent) {
  	agent.add(`𝐁𝐞𝐞𝐟: \n\t ❖Agemawo \n\t ❖Assorted \n\t ❖Beef with bone (bonechop) \n\t ❖Boneless beef \n\t ❖Boneless beef mini \n\t ❖Cow head \n\t ❖Cow heart \n\t ❖Cow hump \n\t ❖Cow intestine \n\t ❖Cow liver \n\t ❖Cow kidney \n\t ❖Cow leg \n\t ❖Cow lung \n\t ❖Cow tail \n\t ❖Minced meat \n\t ❖Ponmo \n\t ❖Shaki \n\t ❖Token pack \nEnter any of the options to select a product.`);
  }
  
  function goat(agent) {
    const auth = agent.context.get("auth");
    const fufilment_center = auth.parameters.fulfilment_center;
    var answer = `𝐆𝐨𝐚𝐭 𝐦𝐞𝐚𝐭: \n`;
    return axios
      .get(`${prod_link}/stocks/items/?fulfilment_center=${fufilment_center}`, {"headers": {
        "Authorization": `Token ${token}`
      }})
      .then((res) => {
        for (let i=0; i < res.data.data.length; i++) {
          const element = res.data.data[i];
          if (Goat.includes(element.bundle_product.toLowerCase())) {
          if (element.pu_quantity != 0) {
          answer +=`❖${element.bundle_product} ₦${element.price}/pack` + `\n`;
          }
      }
      else {
          continue;
        }
        
      } if (answer != "𝐆𝐨𝐚𝐭 𝐦𝐞𝐚𝐭: \n") {
        agent.add(answer + `𝐖𝐡𝐚𝐭 𝐰𝐨𝐮𝐥𝐝 𝐲𝐨𝐮 𝐥𝐢𝐤𝐞 𝐭𝐨 𝐨𝐫𝐝𝐞𝐫?`);
      }else{
      agent.add(`There is no Goat product in store`);}
      })
      .catch((err) => agent.add(`An error occurred ${err.message}`));
      }

  
  function submenu1(agent) {
  	agent.add(`𝐆𝐨𝐚𝐭 𝐦𝐞𝐚𝐭: \n\t ❖Goat assorted \n\t ❖Goat head and leg \n\t ❖Goat meat \n𝐓𝐨𝐤𝐞𝐧: \nEnter any of the options to select a product.`);
  }
  

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
  
  function returnId(prod) {
  var product_id = {};
  return axios.get(`${prod_link}/products/product-unit/`, {"headers": {
    "Authorization": `Token ${token}`
  }}).then((res) => res.data.data
  ).then(data => {
    for (let i=0; i < data.length; i++) {
      product_id[data[i].name] = data[i].id;
      
    }
    if (product_id[prod] != undefined) {
      return product_id[prod];
    } else {
      return undefined;
    }
  }); 
}
  
  function chicken(agent) {
    const auth = agent.context.get("auth");
    const fufilment_center = auth.parameters.fulfilment_center;
    var answer = `𝐂𝐡𝐢𝐜𝐤𝐞𝐧: \n`;
    return axios
      .get(`${prod_link}/stocks/items/?fulfilment_center=${fufilment_center}`, {"headers": {
        "Authorization": `Token ${token}`
      }})
      .then((res) => {
        for (let i=0; i < res.data.data.length; i++) {
          const element = res.data.data[i];
          if (Chicken.includes(element.bundle_product.toLowerCase())) {
          if (element.pu_quantity != 0) {
          answer +=`❖${element.bundle_product} ₦${element.price}/pack` + `\n`;
          }
      }
      else {
          continue;
        }
        
      } if (answer != "𝐂𝐡𝐢𝐜𝐤𝐞𝐧: \n") {
        agent.add(answer + `𝐖𝐡𝐚𝐭 𝐰𝐨𝐮𝐥𝐝 𝐲𝐨𝐮 𝐥𝐢𝐤𝐞 𝐭𝐨 𝐨𝐫𝐝𝐞𝐫?`);
      }else{
      agent.add(`There is no Chicken product in store`);}
      })
      .catch((err) => agent.add(`An error occurred ${err.message}`));
      }
  
  function fish(agent) {
    const auth = agent.context.get("auth");
    const fufilment_center = auth.parameters.fulfilment_center;
    var answer = `𝐅𝐢𝐬𝐡: \n`;
    return axios
      .get(`${prod_link}/stocks/items/?fulfilment_center=${fufilment_center}`, {"headers": {
        "Authorization": `Token ${token}`
      }})
      .then((res) => {
        for (let i=0; i < res.data.data.length; i++) {
          const element = res.data.data[i];
          if (Fish.includes(element.bundle_product.toLowerCase())) {
          if (element.pu_quantity != 0) {
          answer +=`❖${element.bundle_product} ₦${element.price}/pack` + `\n`;
          }
      }
      else {
          continue;
        }
        
      } if (answer != "𝐅𝐢𝐬𝐡: \n") {
        agent.add(answer + `𝐖𝐡𝐚𝐭 𝐰𝐨𝐮𝐥𝐝 𝐲𝐨𝐮 𝐥𝐢𝐤𝐞 𝐭𝐨 𝐨𝐫𝐝𝐞𝐫?`);
      }else{
      agent.add(`There is no Fish product in store`);}
      })
      .catch((err) => agent.add(`An error occurred ${err.message}`));
      }
  
  function submenu2(agent) {
  	agent.add(`𝐂𝐡𝐢𝐜𝐤𝐞𝐧: \n\t ❖Chicken \n\t ❖Gizzard \n𝐓𝐨𝐤𝐞𝐧: \n\t ❖Chicken\nEnter any of the options to select a product.`);
  }
  function itemProduct(agent) {
    const itemChosen = agent.parameters.itemgoat.goat;
    agent.add(`You have indicated an interest in ${itemChosen.goatproduct}, how many packs do you want?`);
  }
  function handleWelcome1(agent) {
    const auth = agent.context.get('auth');
    const name = auth.parameters.name;
    const fufilment_center = auth.parameters.fulfilment_center;
    const fc = {'name': 'fc', 'lifespan': 100, 'parameters': {}};
  	agent.add(`To see all the items in store reply with 𝐬𝐭𝐨𝐫𝐞. \nTo see the categories of our product, reply with 𝐦𝐞𝐧𝐮 \nTo view your what is in your basket, reply with 𝐜𝐚𝐫𝐭. \nTo complain reply with 𝐜𝐨𝐦𝐩𝐥𝐚𝐢𝐧`);
    //agent.add(new Suggestion(`store`));
    //agent.add(new Suggestion(`cart`));
    //agent.add(new Suggestion(`complain`));
    return axios.get(`${prod_link}/fc/center/${fufilment_center}/`, {
        headers : {"Authorization": `Token ${token}`}}).then((res) => {
        //const fc = {'name': 'fc', 'lifespan': 100, 'parameters': {}};
    fc.parameters.fc_address = res.data.data.fulfilment_center_address;
    fc.parameters.agent = res.data.data.fulfilment_agent_name;
    fc.parameters.phone_number = res.data.data.fulfilment_agent_phone_number;
    agent.context.set(fc);
      //agent.add(`FC details saved, ${res.data.data.fulfilment_center_address}, ${res.data.data.fulfilment_agent_name}`);
      }).catch((err) => {
    agent.add(err.message);
  });
      }
  function showCatalogue(agent) {
    var cat = "This is a brief description of products we sell: \n";
  return axios.get(`${prod_link}/stocks/catalogues`, { "headers": 
{"Authorization": `Token ${token}`}}).then((res) => 
  res.data.data
).then(data => {
  for (let i=0; i < data.length; i++) {
    cat += `${data[i].id}.  ${data[i].name}  ${data[i].weight}kg  ₦${data[i].price}/pack \n`;
  } agent.add(cat);
}).catch((err) => {
    agent.add(err.message);
  });
}
  
  function confirmItems(itemValue, number){
  var totalCost = 0;
  const auth = agent.context.get("auth"); 
  const customerID = auth.parameters.customer;//'e2660bf5-73bf-4c59-890a-f4f30cc092b2';
  
    //let itemValue; //item.parameters.item.toLowerCase(),
    //let number ;//item.parameters.number,
    //let id = item.parameters.id || request.body.responseId;
  
  const itemID = store1.indexOf(itemValue); 
  if(false) { 
     let cart = agent.context.get('cart'); 
     let cartId = cart.parameters.id; 
    return axios.post(`${prod_link}/orderings/cart_items/`, {
        "quantity": number, 
        "product": itemID, 
        "cart": cartId
    }, { headers : {"Authorization": `Token ${token}`
    }}).then((res) => {
  
    console.log(`That is ${number} packs of ${itemValue}, Your order has been added to cart, what else would you like to order?`);
    console.log(``); 
    }).catch((err) => {
    console.log(err.response.status);
   });
  } else {
    return axios.get(`${prod_link}/orderings/${customerID}/cart/`, 
    { headers : {"Authorization": `Token ${token}`
     }}).then((res) => {
       var cart = {'name': 'cart', 'lifespan': 100, 'parameters': {}}, 
       //cart.parameters.id
       cartId = res.data.data.id; 
       // agent.context.set(cart);
      // let cartId = cart.parameters.id; 
      // console.log(cartId)
       return axios.post(`${prod_link}/orderings/cart_items/`, {
        "quantity": number, 
        "product": itemID, 
        "cart": cartId
    }, { headers : {"Authorization": `Token ${token}`
    }}).then((res) => {
    return `That is ${number} packs of ${itemValue}, Your order has been added to cart.`;
     
    }).catch((err) => {
    return `An error has just occurred while sending your order to the cart 2. ${cartId}`, err.response.status;
   });

  }).catch((err) => {
  return err.message;
 });
}
}

  
  function confirmItemList(agent) {
  const auth = agent.context.get('auth');
  const product = auth.parameters.product;
  const number = auth.parameters.number;
  var itemconfirm = `Kindly confirm the following items: \n`;
  if (product.length === number.length) {for (let i=0; i<product.length; i++) {
  const prod_count = number[i],
        prod = product[i];
        itemconfirm += `${prod_count} packs of ${prod} \n`;
        agent.add(confirmItems(prod, prod_count));}
  agent.add(`Anything else?`);
} else  {
  agent.add(`Items and quantity have been mismatched. Number of products: ${product.length} and Number of products quantity ${number.length}`);
  
}}

  
  function returnOrder(agent) {
  const auth = agent.context.get('auth');
  const product = auth.parameters.product;
  const number = auth.parameters.number;
  var itemconfirm = `Kindly confirm the following items: \n`;
  if (product.length === number.length) {for (let i=0; i<product.length; i++) {
  const prod_count = number[i],
        prod = product[i];
        itemconfirm += `${prod_count} packs of ${prod} \n`;
        }
  
  agent.add(itemconfirm);
  agent.add(`Anything else?`);
} else  {
  agent.add(`Items and quantity have been mismatched. Number of products: ${product.length} and Number of products quantity ${number.length}`);
  agent.add(product, number);
}}
  
  function resetItemID(agent) {
  var totalCost = 0;
  var answer = `That is `;
  
  const auth = agent.context.get('auth'),
        phone = auth.parameters.phonenumber,
        name = auth.parameters.name,
        customer = auth.parameters.customer,
        address = auth.parameters.address,
        fc = auth.parameters.fulfilment_center,
      itemValue  = capitalizeFirstLetter(auth.parameters.product),
      itemID = store.indexOf(itemValue),
      number = auth.parameters.number;
if(agent.context.get("auth")) {
  const auth = agent.context.get("auth"); 
  const fulfilment_center = auth.parameters.fulfilment_center;
if (store.includes(itemValue.toLowerCase())) {
  return axios.get(`${prod_link}/stocks/items/?fulfilment_center=${fulfilment_center}` , {"headers": {
    "Authorization": `Token ${token}`
  }} )
  .then((res) => {
    if (res.data.data.length != 0) {
    const element = res.data.data;
    for (let i=0; i < element.length; i++) {
  if (itemValue.toLowerCase() === element[i].bundle_product.toLowerCase() && element[i].pu_quantity >= number) {
      var totalCost = number * parseFloat(element[i].price);
  answer += `${number == 1 ? `${number} pack`: `${number} packs`} of ${itemValue}, this costs ₦${totalCost} Can you please confirm this by replying with either 𝐲𝐞𝐬 or 𝐧𝐨?`;
    
    }else if(itemValue.toLowerCase() === element[i].bundle_product.toLowerCase() && element[i].pu_quantity < number) {
      answer = `We have only ${element[i].pu_quantity==1 ? `${element[i].pu_quantity} pack`: `${element[i].pu_quantity} packs`} of ${itemValue} in store. Will you like to add to cart?`;
      const auth = {'name': 'auth', 'lifespan': 100, 'parameters': {}};
      auth.parameters.number = String(element[i].pu_quantity);
      auth.parameters.phonenumber = phone;
      auth.parameters.name = name;
      auth.parameters.customer = customer;
      auth.parameters.address =  address;
      auth.parameters.fulfilment_center =fc;
      //agent.add(auth.parameters.number);
      agent.context.set(auth);
    }
    } if (answer.length > 10) {
      agent.add(answer);
      //agent.add(new Suggestion(`yes`));
      //agent.add(new Suggestion(`no`));
    } else {
      agent.add(`${capitalizeFirstLetter(itemValue)} is not found in the store, You can search for what we have in the store by typing "store"`);
    }
  } else {agent.add(`This fulfillment center has nothing in store`);} 
  })
  .catch((err) => {agent.add(err.message);
         agent.add(`Hi, welcome, reply with your name and valid phone number \ne.g. Shade Adefemi, 08212324456`, err.message);});  
    } else {
      agent.add(`${itemValue} is not found in the store, You can search for what we have in the store by typing "What is in the store"`);
    }
}else {
agent.add("Kindly reply with your full name and phone number to get access to the store \ne.g. Shade Adefemi, 08212324456"); 
}
  }
  
  function confirmItem(agent){
        var totalCost = 0;
        var params = [];
        const auth = agent.context.get("auth");
    	//const limit = agent.context.get("exlimit");
    	const item = agent.context.get("auth");
        const product = auth.parameters.product;
        const fulfilment_center = auth.parameters.fulfilment_center;
        const customerID = auth.parameters.customer;
        //const item = {'name': 'item', 'lifespan': 70, 'parameters': {}};
        //item.parameters.id = returnId(product);
        //item.parameters.product = product;
        agent.context.set(item);
          const itemValue  = item.parameters.product.toLowerCase(),
              number = parseInt(auth.parameters.number);
              params.push(number);
              // id = item.parameters.id || request.body.responseId;
              return axios.get(`${prod_link}/products/product-unit`,
              { headers : {"Authorization": `Token ${token}`
            }}).then((res) => {
              
              for (let i=0; i < res.data.data.length; i++) {
              const element = res.data.data[i];
              if (element.name.toLowerCase() === itemValue) {
              const itemID = element.id;
              item.parameters.id = itemID;
              params.push(itemID);
              } else {
                continue;
              }}
              return axios.get(`${prod_link}/orderings/${customerID}/cart/`, 
          { headers : {"Authorization": `Token ${token}`
           }}).then((res) => {
             
            var cart = {'name': 'cart', 'lifespan': 100, 'parameters': {}};
             cart.parameters.id = res.data.data.id;
             const cartId = res.data.data.id;
             params.push(cartId); 
             
             
             return axios.post(`${prod_link}/orderings/cart_items/`,
             {"quantity": params[0], 
             "cart": params[2], 
             "product": params[1]
            },
             { headers : {"Authorization": `Token ${token}`
            }}).then((res) => {
              const element = res.data.data;
              agent.add(`That is ${element.quantity == 1 ? `${element.quantity} pack`: `${element.quantity} packs`}  of ${element.bundle_product}, Your order has been added to cart, what else would you like to order?`);
            }).catch((err) => {
            if (err.response.status === 400){
              	agent.add(auth.parameters.limit);
      			//agent.add(limit.parameters.exceed);
                agent.add(`${itemValue} does not exist`);
            } else{
              agent.add(err.message, 1);
            }
          });
           }).catch((err) => {
           agent.add(`Kindly reply with your full name and phone number \ne.g. Shade Adefemi, 08212324456`, err.message);
          });
            }).catch((err) => {
              agent.add(`${capitalizeFirstLetter(product)} is not available in store`);
            });
        }
  
  function handleShowBasket(agent){
  const auth = agent.context.get('auth');
  var answer = "Hi! This is what you have in your cart: \n";
  var val_amt = 0;
    if(agent.context.get("auth")) {
      const auth = agent.context.get("auth"); 
      const customerID = auth.parameters.customer;
      return axios.get(`${prod_link}/orderings/${customerID}/cart/`, 
      { headers : {"Authorization": `Token ${token}`
       }}).then((res) => {
         var cart = {'name': 'cart', 'lifespan': 100, 'parameters': {}}; 
         cart.parameters.id = res.data.data.id; 
         agent.context.set(cart);
        const cartId = res.data.data.id; 
        //console.log(cartId);
        return axios
        .get(`${prod_link}/orderings/carts/${cartId}/items/`, {"headers": {
          "Authorization": `Token ${token}`
        }})
        .then((res) => {
          if (res.data.data.length > 0) {
            res.data.data.slice(0, res.data.length).map((data, i) => {
              val_amt += parseInt(data.price) * parseInt(data.quantity);
              answer +=` ${data.quantity == 1 ? `${data.quantity} pack`: `${data.quantity} packs`} of ${data.bundle_product} = ₦${parseInt(data.price) * parseInt(data.quantity)}` + "\n ";
            });
            //agent.add(`𝐓𝐡𝐞 𝐭𝐨𝐭𝐚𝐥 𝐜𝐨𝐬𝐭 𝐢𝐬 ${val_amt}`);
            cart.parameters.amount = val_amt;
            agent.add(answer + `Which cost ₦${val_amt}, note that delivery costs ₦𝟑𝟎𝟎 \nTo remove items from your cart, reply with remove and item name e.g. 𝐫𝐞𝐦𝐨𝐯𝐞 𝐩𝐨𝐧𝐦𝐨 \nDo you want 𝐩𝐢𝐜𝐤𝐮𝐩 or 𝐝𝐞𝐥𝐢𝐯𝐞𝐫𝐲 `);//\n_Orders made after 5:00PM will be scheduled for the following day_`);
            //agent.add(new Suggestion(`*pickup*`));
            //agent.add(new Suggestion(`*delivery*`));
          } else {
            agent.add("You have nothing in your cart, Kindly reply with a product name to add to cart.");
          }
          
        })
        .catch((err) => agent.add("An error has occurred while trying to get your cart details", err.message));

    }).catch((err) => {
    agent.add(`Hi, welcome, reply with your full name and valid phone number \ne.g. Shade Adefemi, 08212324456.`, err.response.status);
   });
    }
    else {

      agent.add("Kindly reply with your full name and your phone number \ne.g. Shade Adefemi, 08212324456 to make an order.");
    }
  //agent.add("Kindly add to your cart by placing an order for an item"); 
  }

 
  function fallback(agent) {
    const auth = agent.context.get('auth');
    if (agent.context.get('auth')) {
        agent.add(`To see all the items in store reply with 𝐬𝐭𝐨𝐫𝐞. \nTo see the categories of our product, reply with 𝐦𝐞𝐧𝐮 \nTo view your what is in your basket, reply with 𝐜𝐚𝐫𝐭. \nTo complain reply with 𝐜𝐨𝐦𝐩𝐥𝐚𝐢𝐧`);
  }else{agent.add(`Hi!  👋 reply with your full name and valid phone number \ne.g. Shade Adefemi, 08212324456`);}
    //agent.add(`I'm sorry, can you try again?`);
  }
  function menu_fall(agent) {
  	agent.add(`I do not understand that. Please kindly follow the given instruction(s).`);
  }
  
  function handleFinishOrder(agent) {
    const auth = agent.context.get("auth");
    const fufilment_center = auth.parameters.fulfilment_center;
    const confirm = {'name': 'confirm', 'lifespan': 10, 'parameters': {}};
    if(agent.context.get("cart")) {
    let cart = agent.context.get("cart"); 
    let id = cart.parameters.id; 
      
    return axios.post(`${prod_link}/payments/cart/finish_orders/`, {
     "cart_id": id,
      "payment_method_id": 2, 
      "delivery_method_id": 1
       }, { headers : {"Authorization": `Token ${token}`
      }}).then((res) => {
      //agent.add(`${res.data.data.id}`);
      confirm.parameters.id = res.data.data.id;
      agent.context.set(confirm);
        emptyBasket();
      
       agent.add(`Kindly make payment to: ${res.data.data.bank_name} \nAcct number: ${res.data.data.account_number} \nAmount: ₦${res.data.data.amount_to_be_paid}. \nReply with 𝐬𝐭𝐚𝐭𝐮𝐬 to check your payment status. \nLink expires in ${10} minutes.`);
       //agent.add(new Suggestion(`status`));    
      }).catch((err) => {
      agent.add("This error has just occurred while placing your order.");
     });
    }else {
      agent.add("For checkout successfully, you need to add items to your cart"); 
    }
    
    }
  
  function handleFinishOrder1(agent) {
  const auth = agent.context.get('auth');
  const fc = agent.context.get('fc');
  const confirm = {'name': 'confirm', 'lifespan': 10, 'parameters': {}};
  const fufilment_center = auth.parameters.fulfilment_center;
  if(agent.context.get("cart")) {
  let cart = agent.context.get("cart"); 
  let id = cart.parameters.id; 
  
  return axios.post(`${prod_link}/payments/cart/finish_orders/`, {
    "cart_id": id,
    "payment_method_id": 2, 
    "delivery_method_id": 2
     }, { headers : {"Authorization": `Token ${token}`
    }}).then((res) => {
    //agent.add(`${res.data.data.id}`);
    confirm.parameters.id = res.data.data.id;
    agent.context.set(confirm);
      emptyBasket(); 
    agent.add(`Kindly make payment to: ${res.data.data.bank_name} \nAcct number: ${res.data.data.account_number} \nAmount: ₦${res.data.data.amount_to_be_paid}. \nLink expires in ${10} minutes. \nReply with 𝐬𝐭𝐚𝐭𝐮𝐬 to check your payment status. \n𝘒𝘪𝘯𝘥𝘭𝘺 𝘱𝘪𝘤𝘬 𝘺𝘰𝘶𝘳 𝘰𝘳𝘥𝘦𝘳𝘴 𝘣𝘦𝘧𝘰𝘳𝘦 6:00 𝘗𝘔. \nTo pick up your order, kindly go to: ${fc.parameters.fc_address} or call ${fc.parameters.agent} on ${fc.parameters.phone_number}`);
    //agent.add(new Suggestion(`status`));

    }).catch((err) => {agent.add(err.message);
    agent.add("This error has just occurred while placing your order.");
   });
  }else {
    agent.add("For checkout successfully, you need to add items to your cart"); 
  }
}
  
  function handleFinishOrderWithCash(agent) {
    const auth = agent.context.get('auth');
    const fufilment_center = auth.parameters.fulfilment_center;
    if(agent.context.get("cart")) {
    let cart = agent.context.get("cart"); 
    let id = cart.parameters.id;
    let total_amt = cart.parameters.amount;
    
    return axios.post(`${prod_link}/payments/cart/finish_orders/`, {
      "cart_id": id,
      "payment_method_id": 1, 
      "delivery_method_id": 1
       }, { headers : {"Authorization": `Token ${token}`
      }}).then((res) => {
        emptyBasket();
       agent.add(`Hi, Your order with cart_id #${id} has been successfully sent to our store. \nThe total cost of your order is ₦${total_amt+300}.`);
      }).catch((err) => {
    agent.add(`An error just occurred ${err.message}`);});
    }else {
      agent.add("For checkout successfully, you need to add items to your cart"); 
    }
    
    }
  
  function handleFinishOrderWithCash1(agent) {
    const auth = agent.context.get('auth');
    const fufilment_center = auth.parameters.fulfilment_center;
    if(agent.context.get("cart")) {
    let cart = agent.context.get("cart"); 
    let id = cart.parameters.id;
    let total_amt = cart.parameters.amount;
    
    return axios.post(`${prod_link}/payments/cart/finish_orders/`, {
      "cart_id": id,
      "payment_method_id": 1, 
      "delivery_method_id": 2
       }, { headers : {"Authorization": `Token ${token}`
      }}).then((res) => {
        emptyBasket(); 
       agent.add(`Hi, Your order with cart_id #${id} has been successfully sent to our store. \nThe total cost of your order is ₦${total_amt}.`);
      return axios.get(`${prod_link}/fc/center/${fufilment_center}/`, {
        headers : {"Authorization": `Token ${token}`}}).then((res) => {
        agent.add(`To pick up your order, kindly go to: ${res.data.data.fulfilment_center_address} or call ${res.data.data.fulfilment_agent_name} on ${res.data.data.fulfilment_agent_phone_number}`);});
           
      }).catch((err) => {
      agent.add("This error has just occurred while placing your order.");
     });
    }else {
      agent.add("For checkout successfully, you need to add items to your cart"); 
    }
    
    }
  
  function productFaq(agent) {
    const auth = agent.context.get("auth");
  	const product = auth.parameters.product;
    agent.add(`${product}`);
  }
  function completeWithCash(agent) {
  if (agent.context.get("ordrerconfirm-yes-pickup")) {
  	return handleFinishOrderWithCash1(agent);
  }else if (agent.context.get("orderconfirm-yes-home")) {
  	return handleFinishOrderWithCash(agent);
  }else {
  	agent.add(`For smooth ordering, kindly stick to the given options`);
  }}
  
  function completeWithTransfer(agent) {
  if (agent.context.get("ordrerconfirm-yes-pickup")) {
  	return handleFinishOrder1(agent);
  }else if (agent.context.get("orderconfirm-yes-home")) {
  	return handleFinishOrder(agent);
  }else {
  	agent.add(`For smooth ordering, kindly stick to the given options`);
  }}
  
  function mannyOptions(agent) {
  if (agent.context.get('auth')){
  	agent.add(`Do you want to add more product e.g 2 packs of shaki or remove an item? e.g remove cow tail`);
  } else{
  	agent.add(`Please enter your name and valid phone number e.g. Shade Adefemi, 08212324456`);}}
  function emptyBasket() {
  	let basketContext = {'name': 'basket', 'lifespan': 0},
        cartContext = {'name': 'cart', 'lifespan': 0},
        itemContext = {'name': 'item', 'lifespan': 0};
    agent.context.set(basketContext);
    agent.context.set(itemContext);
    agent.context.set(cartContext);
    
  }
  function validateTime(agent) {
  const auth = agent.context.get('auth');
  var closeTime = new Date();
  var now = new Date();
  var fcCloseTime = new Date();
  fcCloseTime.setHours(18); fcCloseTime.setMinutes(0); fcCloseTime.setSeconds(0);
  now.setMinutes(now.getMinutes() + 60); // make timestamp GMT+1
  now = new Date(now); // Date object
  closeTime.setHours(17); closeTime.setMinutes(0);
    if(now.getTime() <= closeTime.getTime()) {
      agent.add(`Reply with 𝐭𝐫𝐚𝐧𝐬𝐟𝐞𝐫 for delivery, we only accept transfer for delivery`);
      //agent.add(new Suggestion(`cash`));
      //agent.add(new Suggestion(`transfer`));
    } else if (now.getTime() > fcCloseTime.getTime()) {
      agent.add(`Our FCs have closed for the day. \nDo you want to schedule your delivery for tomorrow?`);
      //agent.add(new Suggestion(`yes`));
      //agent.add(new Suggestion(`no`));
    } else if (now.getTime() >= closeTime.getTime() && now.getTime() <= fcCloseTime.getTime()) {
      agent.add(`The time of ordering is ${now.toLocaleTimeString()} which is past ${closeTime.toLocaleTimeString()}. \nYour order can been scheduled for the following day.\nDo you want to schedule for tomorrow?`);
      //agent.add(new Suggestion(`yes`));
      //agent.add(new Suggestion(`no`));
    }}
  function validateTime1(agent) {
  const auth = agent.context.get('auth');
  var now = new Date();
  var fcCloseTime = new Date();
  fcCloseTime.setHours(18); fcCloseTime.setMinutes(0); fcCloseTime.setSeconds(0);
  now.setMinutes(now.getMinutes() + 60); // make timestamp GMT+1
  now = new Date(now); // Date object
    if(now.getTime() <= fcCloseTime.getTime()) {
      agent.add(`Reply with 𝐭𝐫𝐚𝐧𝐬𝐟𝐞𝐫 for pickup, we only accept transfer`);
      //agent.add(new Suggestion(`cash`));
      //agent.add(new Suggestion(`transfer`));
    } else if (now.getTime() > fcCloseTime.getTime()) {
      agent.add(`Our FCs have closed for the day. \nDo you want to schedule for tomorrow?`);
      //agent.add(new Suggestion(`yes`));
      //agent.add(new Suggestion(`no`));
    } 
  }
  function deleteCart(agent) {
    const auth = agent.context.get('auth');
    const cart = agent.context.get('cart');
    const cart_id = cart.parameters.id;
    return axios.delete(`${prod_link}/orderings/carts/${cart_id}/`, {"headers": {
      "Authorization": `Token ${token}`
    }}).then((res) => {
      agent.add(`Your cart has been successfully deleted.`);
    }).catch((err) =>{
      agent.add(err.message);
    });
  }

  function removeprod1(agent){
  const cart = agent.context.get('cart');
  //const item = agent.context.get('item');
  const cart_id = cart.parameters.id;
  const product = cart.parameters.product;
  const remove = {'name': 'remove', 'lifespan': 20, 'parameters': {}};
  return axios.get(`${prod_link}/orderings/cart_items/` , {"headers": {
    "Authorization": `Token ${token}`
  }} )
  .then((res) => {
    res.data.data.forEach((res) => {
      if (res.cart===cart_id && res.bundle_product.toLowerCase()===product.toLowerCase()) {
        remove.parameters.id = res.id;
          agent.context.set(remove);
        agent.add(`You want to remove ${product} right?`);
        //agent.add(new Suggestion(`yes`));
        //agent.add(new Suggestion(`no`));
      }
    });
    if (remove.parameters.id === undefined) {
      agent.add(`${product} is not in cart`);
    } else {
      //agent.add(`You want to remove ${product} right?`);
    }
}).catch((err) => {
  
    agent.add(`${product} is not in your cart`);
});
}
  function remove(agent) {
    const auth = agent.context.get('auth');
    const remove = agent.context.get('remove');
    const product = auth.parameters.product;
    const prod_id = remove.parameters.id;
    return axios.delete(`${prod_link}/orderings/cart_items/${prod_id}/`, {"headers": {
      "Authorization": `Token ${token}`
    }}).then((res) => {
      agent.add(`${capitalizeFirstLetter(product)} has been successfully removed.`);
    }).catch((err) =>{
      agent.add(err.message);
    });
  }  

  function confirmPayment(agent) {
    const auth = agent.context.get('auth');
    const confirm = agent.context.get('confirm');
    const payment_id = confirm.parameters.id;
    if (agent.context.get('auth')) {
    return axios.get(`${prod_link}/payments/get-payment-status/${payment_id}/`, {"headers": {
      "Authorization": `Token ${token}`
    }}).then((res) => {
      const answer = res.data.data.data.toLowerCase();
      if (answer==='pending') {
      agent.add(`Your payment status is pending`);
      } else if (answer==='payment failed') {
      agent.add(`Your payment was not successful`);
      } else if (answer==='paid') {
      agent.add(`Your payment was successful`);
      } else {
      agent.add(`Your payment status is Unknown`);
      }
      //agent.add(`${res.data.data.payment_status_name}`);
    }).catch((err) =>{
      agent.add(err.message);
    });
    } else {
    	agent.add(`To confirm your transaction, kindly enter your full name and phone number. Then reply with 𝐬𝐭𝐚𝐭𝐮𝐬`);
    }
  }
  

 function complaint(agent) {
  agent.add(`We are sorry about that \nKindly call 018885514`);
 }
  
function region(agent) {
 const region = agent.context.get('region');
 //const auth = agent.context.get('auth');
 var miss = {};
 let answer = 'Kindly select the closest fc to you: \n';
  return axios.get(`${prod_link}/fc/stocks/`,{ headers : {"Authorization": `Token ${token}`
 }}).then((res) => {
  var items = res.data.data;
  for (var item, i=0; !!(item=items[i]); i += 1) {
    var name = item.fulfilment_center_name;
    if (!(name in miss)) {
      miss[name] = item.fulfilment_center;
      answer += `${name} reply with ${item.fulfilment_center}\n`;
    } 
  }
    agent.add(answer);
}).catch((err) => {
  agent.add(err.message);
  });
  }
 
  function handleNew(agent) {
  const region = agent.context.get('region');
  const auth = agent.context.get('auth');
  const phone_number = auth.parameters.phonenumber;
  const name = auth.parameters.name.name;
  const address = auth.parameters.any;
  const id = region.parameters.number;
  if (auth.parameters.address) {
  return axios.patch(`${prod_link}/customers/${phone_number}/`, {
    "phone_number": phone_number,
    "name": name,
    "address": address,
    "fulfilment_center": id
  },{ headers : {"Authorization": `Token ${token}`
}}).then((res) => {
    const auth = {'name': 'auth', 'lifespan': 100, 'parameters': {}};
     auth.parameters.phonenumber = phone_number;
     auth.parameters.name = res.data.data.name;
     auth.parameters.customer = res.data.data.id;
     auth.parameters.address =  res.data.data.address;
     auth.parameters.fulfilment_center = res.data.data.fulfilment_center; 
     agent.context.set(auth);
  agent.add(`Hi ${capitalizeFirstLetter(auth.parameters.name)}, 👋 Welcome to SendMe store \nTo see all the items in store reply with 𝐬𝐭𝐨𝐫𝐞. \nTo view your what is in your basket, reply with 𝐜𝐚𝐫𝐭. \nTo complain reply with 𝐜𝐨𝐦𝐩𝐥𝐚𝐢𝐧`);
} 
).catch((err) => {
  
    agent.add(err.message);
  
});
} else {
  return axios.post(`${prod_link}/customers/`, {
    "phone_number": phone_number,
    "name": name,
    "address": address,
    "fulfilment_center": id
  },{ headers : {"Authorization": `Token ${token}`
}}).then((res) => {
    const auth = {'name': 'auth', 'lifespan': 100, 'parameters': {}};
     auth.parameters.phonenumber = phone_number;
     auth.parameters.name = res.data.data.name;
     auth.parameters.customer = res.data.data.id;
     auth.parameters.address =  res.data.data.address;
     auth.parameters.fulfilment_center = res.data.data.fulfilment_center; 
     agent.context.set(auth);
  agent.add(`Hi ${capitalizeFirstLetter(auth.parameters.name)}, 👋 Welcome to SendMe store \nTo see all the items in store reply with 𝐬𝐭𝐨𝐫𝐞. \nTo view your what is in your basket, reply with 𝐜𝐚𝐫𝐭. \nTo complain reply with 𝐜𝐨𝐦𝐩𝐥𝐚𝐢𝐧`);
} 
).catch((err) => {
  
    agent.add(err.message);
  
});
}
}
 function update(agent) {
const response = {
  "richContent": [
    [
      {
        "type": "info",
        "title": "Change Address",
        "actionLink": "https://web-bot-nine.vercel.app/?phoneNumber=07062861768&existing_customer=true"
      }
    ]
  ]
};
    //agent.add(new Payload('PLATFORM_UNSPECIFIED', JSON.stringify(response)), { sendAsMessage:true, rawPayload:false });
    agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true, sendAsMessage: true}));
}
  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('catalogue', catalogue);
  intentMap.set('Default Welcome Intent', handleWelcome);
  intentMap.set('Default Welcome Intent-yes', handleWelcome1);
  intentMap.set('Default Welcome Intent-no', changeAddress);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('start.order.fallback', menu_fall);
  intentMap.set('remove.product', removeprod1);
  intentMap.set('remove.product.yes', remove);
  intentMap.set('payment.confirm', confirmPayment);
  intentMap.set('complain', complaint);
  intentMap.set('test.payload', update);
  intentMap.set('region', region);
  intentMap.set('register', handleNew);
  //intentMap.set('auth.register', handleWelcome);
  //intentMap.set('catalogue', showCatalogue);
  intentMap.set('Default.Welcome.Intent.yes.fallback', menu_fall);
  intentMap.set('Menu', menu);
  intentMap.set('Menu-fish', fish);
  intentMap.set('Default.Welcome.Intent-yes.menu', menu);
  intentMap.set('Menu-cow', cow);
  intentMap.set('Menu-cow-confirm', resetItemID);
  intentMap.set('Welcome.Intent-yes.menu-cow', cow);
  intentMap.set('Menu-goat', goat);
  intentMap.set('Menu-goat-confirm', returnOrder);
  intentMap.set('Welcome.Intent-yes.menu-goat', goat);
  intentMap.set('Menu-chicken', chicken);
  intentMap.set('Menu-chicken-confirm', returnOrder);
  intentMap.set('Welcome.Intent-yes.menu-chicken', chicken);
  intentMap.set('Default.Welcome.Intent.yes.store', showStore);
  intentMap.set('show.store', showStore);
  intentMap.set('Default.Welcome.Intent-yes.store', showStore);
  intentMap.set('Default.Welcome.Intent.yes.start.order', resetItemID);
  intentMap.set('order.start', resetItemID);
  intentMap.set('Welcome.Intent-yes.menu-cow-order', resetItemID);
  intentMap.set('Welcome.Intent-yes.menu-cow-order - no', handleShowBasket);
  intentMap.set('Welcome.Intent-yes.menu-goat-order', resetItemID);
  intentMap.set('Welcome.Intent-yes.menu-goat-order - no', handleShowBasket);
  intentMap.set('Welcome.Intent-yes.menu-chicken-order', resetItemID);
  //intentMap.set('order.start-yes', mannyOptions);
  intentMap.set('order.showbasket', handleShowBasket);
  intentMap.set('Welcome.Intent-yes.menu-chicken-order - no', handleShowBasket);
  intentMap.set('start.order.no', handleShowBasket);
  intentMap.set('Menu-fallback', fallback);
  intentMap.set('cash', completeWithCash);
  intentMap.set('transfer', completeWithTransfer);
  intentMap.set('order.confirm', confirmItem);
  intentMap.set('confirm.address', viewAdress);
  intentMap.set('faq.1', productFaq);
  intentMap.set('Default.Welcome.Intent-fallback', menu_fall);
  intentMap.set('cancel.order.yes', deleteCart);
  intentMap.set('start.order.no.home.no.no.cancel', deleteCart);
  intentMap.set('start.order.no.pick.no', deleteCart);
  intentMap.set('start.order.no.home', validateTime);
  intentMap.set('start.order.no.pick', validateTime1);
  intentMap.set('start.order.no.pick.yes.cash', handleFinishOrderWithCash1);
  intentMap.set('start.order.no.pick.yes.transfer', handleFinishOrder1);
  intentMap.set('start.order.no.home.transfer', handleFinishOrder);
  intentMap.set('start.order.no.home.yes.transfer', handleFinishOrder);
  intentMap.set('order.start.no.home.transfer', handleFinishOrder);
  intentMap.set('start.order.no.home.cash', handleFinishOrderWithCash);
  intentMap.set('start.order.no.home.yes.cash', handleFinishOrderWithCash);
  intentMap.set('order.start.no.home.cash', handleFinishOrderWithCash);
  intentMap.set('start.order.no.pick.transfer', handleFinishOrder1);
  intentMap.set('order.start.no.pick.transfer', handleFinishOrder1);
  intentMap.set('start.order.no.home.no.yes.transfer', handleFinishOrder1);
  intentMap.set('start.order.no.pick.cash', handleFinishOrderWithCash1);
  intentMap.set('order.start.no.pick.cash', handleFinishOrderWithCash1);
  intentMap.set('start.order.no.home.no.yes.cash', handleFinishOrderWithCash1);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});