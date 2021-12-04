let fetch = require('node-fetch');

function sendNotify(artist, albumName){
    return fetch('http://localhost:8081/api/notify',{
        method : 'post',
        body :  JSON.stringify({
                    artistId: artist.id,
                    subject:`Nuevo album para artista ${artist.name}`,
                    message:`Se ha agregado el album ${albumName} al artista ${artist.name}`}),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
}

module.exports = sendNotify;