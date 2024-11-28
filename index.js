require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');  


async function sendTemplateMessage() {
    try {
        const response = await axios({
            url: 'https://graph.facebook.com/v20.0/439717779228376/messages',
            method: 'post',
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                messaging_product: 'whatsapp',
                to: '919309996326',
                type: 'template',
                template:{
                    name:'hello_world',
                    language:{
                        code:'en_US'
                    }
                }
            })
        });

        console.log('response: ', response.data);
    } catch (error) {
        console.error('Error sending message: ', error.response ? error.response.data : error.message);
    }
}

// sendTemplateMessage();

async function sendTextMessage() {
    try {
        const response = await axios({
            url: 'https://graph.facebook.com/v20.0/439717779228376/messages',
            method: 'post',
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                messaging_product: 'whatsapp',
                to: '919309996326',
                type: 'text',
                text:{
                   body: 'This is a text message from node js!!'
                }
            })
        });

        console.log('response contacts : ', response.data.contacts);
        
        console.log('/////////////////////////////////////////');

        console.log('response messages : ', response.data.messages);
    } catch (error) {
        console.error('Error sending message: ', error.response ? error.response.data : error.message);
    }
}

// sendTextMessage()

var mediaId2 = ''

async function uploadMedia() {
    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream('./images/qr_webapp.png'));  // Update this path to your local image
        formData.append('messaging_product', 'whatsapp'); 

        const response = await axios({
            url: `https://graph.facebook.com/v20.0/${process.env.PHONE_NUMBER_ID}/media`,
            method: 'post',
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                ...formData.getHeaders(),
            },
            data: formData
        });

        console.log('Uploaded media ID:', response.data.id);
        // console.log('Uploaded media ID:', response);
        // mediaId2 = response.data.id;
        return response.data.id;  // Return the media ID for use in the next step
    } catch (error) {
        console.error('Error uploading media:', error.response ? error.response.data : error.message);
    }
}



// uploadMedia()


async function sendMedia(mediaId, recipientId) {
    try {
        const response = await axios({
            url: `https://graph.facebook.com/v20.0/${process.env.PHONE_NUMBER_ID}/messages`,  // Use the correct phone number ID here
            method: 'post',
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json',
            },
            data: {
                messaging_product: 'whatsapp',
                to: recipientId,  // Recipient's phone number
                type: 'image',     // Change this to the type of media you're sending
                image: {
                    id: mediaId,   // Media ID from the upload response
                },
            }
        });

        console.log('Media sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending media:', error.response ? error.response.data : error.message);
    }
}

// // Usage
// const mediaId = '869810835220851';  // The media ID from the upload response
// const recipientId = '919309996326'; // Replace with the recipient's phone number
// sendMedia(mediaId, recipientId);


async function main() {
    // Call uploadMedia and get the mediaId
    const mediaId1 = await uploadMedia();
    
    if (mediaId1) {
        // Define the recipient's phone number
        const recipientId = '919309996326'; // Replace with the recipient's phone number
        
        // Call sendMedia with the mediaId1 and recipientId
        await sendMedia(mediaId1, recipientId);
    } else {
        console.log("Failed to upload media, skipping sending media.");
    }
}

main()