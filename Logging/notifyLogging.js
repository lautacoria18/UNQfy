let fetch = require('node-fetch')

function sendNotify(mensaje, tipo) {
    return fetch('http://localhost:8082/api/enviarLog',{
        method : 'post',
        body: JSON.stringify({mensaje : mensaje, tipo: tipo}),
        headers: {
            'Content-Type' : 'application/json'
        } 
    }).then(res => res.json())   
}

module.exports = sendNotify ;