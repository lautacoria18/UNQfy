const Observer = require('./observer');
const observer = require ('./observer')
let fetch = require('node-fetch');

class ObserverNewsLetter extends observer {

    constructor (email){
        super();
        this.emailSuscriptor= email;
    }

    notify(objeto, name, evento){


        if (evento === "albumArtista"){

            this.notifyNewsletter(objeto, name);
        
        }


    //simplemente notifica depende del evento
}

notifyNewsletter(artist, albumName){
    return fetch('http://localhost:8081/api/notify',{
        method : 'post',
        body :  JSON.stringify({
                    artistId: artist.id,
                    email: this.emailSuscriptor,
                    subject:`Nuevo album para artista ${artist.name}`,
                    message:`Se ha agregado el album ${albumName} al artista ${artist.name}`}),
                    
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())

}


}

module.exports = ObserverNewsLetter;