let fetch = require('node-fetch')

function sendNotifyUNQfy(){
    return fetch('http://localhost:8083/api/statusUNQfy', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({StatusUNQfy: 'ON'})
    }).then(res => res.json())
    .catch(err => console.error(err))
}

function sendNotifyNewsletter(){
    return fetch('http://localhost:8083/api/statusNewsletter', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({StatusNewsletter: 'ON'})
    }).then(res => res.json())
}


function sendNotifyLogging(){
    return fetch('http://localhost:8083/api/statusLogging', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({StatusLogging: 'ON'})
    }).then(res => res.json())
}



module.exports = { sendNotifyUNQfy, 
                   sendNotifyNewsletter,
                   sendNotifyLogging 
                 };
