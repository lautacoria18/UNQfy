let fetch = require('cross-fetch')

function sendNotificationToDiscordChanell(mensaje){
    let date = new Date();

    return fetch('https://discord.com/api/webhooks/907744622409822209/47AfrkEmzNPuoVELsJTw0Gb9bQpXykOjFcOoLvIIfQUgINHPNJW5WjZHY3xMdH2hc5dr',{
        method: 'POST',
        body: JSON.stringify({content: date + ': ' + mensaje}),
        headers: {
            'Content-type' : 'application/json'
        }
    })
}

function send(){


}
module.exports = sendNotificationToDiscordChanell;