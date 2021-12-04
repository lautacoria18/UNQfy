const observer = require ('./observer');
let fetch = require('node-fetch');

class ObserverLogging extends observer {


    notify(objeto, name, evento){


        if (evento === "albumNuevo"){ //OK
            this.notifyLogging('Se agrego el album ' + objeto.name + ' al artista ' + name, 'info');
        }
        else if (evento === "artistaNuevo") { //OK
            this.notifyLogging('Se agrego el artista ' + objeto.name, 'info');
        }
        else if (evento === "trackNuevo") {//OK
            this.notifyLogging('Se agrego el track ' + objeto.name + ' al album '+ name, 'info');
        }
        else if (evento === "artistaEliminado") {//OK
            this.notifyLogging('Se elimino el artista ' + objeto.name, 'info');
        }
        else if (evento === "albumEliminado") {//OK
            this.notifyLogging('Se elimino el album ' + objeto.name + ' del artista ' + name, 'info');
        }
        else if (evento === "trackEliminado") {//OK
            this.notifyLogging('Se elimino el track ' + name + ' del album ' + objeto.name, 'info');
        }
        else if (evento === "errorArtistaEliminado"){//OK
            this.notifyLogging('No se elimino el artista ' + name + ' porque no existe' , 'error')
        }
        else if (evento === "errorAlbumEliminado"){//OK
            this.notifyLogging('No se elimino el album ' + name + ' porque no existe' , 'error')
        }
        else if (evento === "errorTrackEliminado"){//OK
            this.notifyLogging('No se elimino el track ' + name + ' porque no existe' , 'error')
        }
        else if (evento === "errorArtistaExiste"){ //OK
            this.notifyLogging('No se agrego el artista ' + objeto.name + ' porque ya existe' , 'error')
        }
        else if (evento === "errorAlbumExiste"){ //OK
            this.notifyLogging('No se agrego el album ' + objeto.name + ' porque ya existe' , 'error')
        }
        else if (evento === "errorArtistaNoExiste"){ //OK
            this.notifyLogging('No se agrego el album ' + objeto.name + ' porque el artista no existe' , 'error')
        }
        else if (evento === "errorTrackExiste"){ //OK
            this.notifyLogging('No se agrego el track ' + objeto.name + ' porque el track ya existe' , 'error')
        }
        else if (evento === "errorAlbumNoExiste"){//OK
            this.notifyLogging('No se agrego el track ' + objeto.name + ' porque el album no existe' , 'error')
        }
}

notifyLogging(mensajeDado, tipoDeMensaje){
    return fetch('http://localhost:8082/api/enviarLog',{
        method : 'post',
        body: JSON.stringify({mensaje : mensajeDado, tipo: tipoDeMensaje}),
        headers: {
            'Content-Type' : 'application/json'
        } 
    }).then(res => res.json())   
}


}

module.exports = ObserverLogging;