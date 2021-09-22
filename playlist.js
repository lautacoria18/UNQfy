class Playlist{

constructor (playlistData, newId){
    if (playlistData !== undefined){
this.name= playlistData.playlistName;
this.maxDuration= playlistData.duration;
this.genres= playlistData.genres;
this.tracks= [];
this.id= newId;
this.currentDuration=0;
    }
}


duration(){

    return this.currentDuration;
}

hasTrack(track){

    return this.tracks.includes(track);
}

addTrack(track){
    if(!this.hasTrack(track)){
        let duration = this.duration() + track.duration;
        if(duration <= this.maxDuration){
            this.tracks.push(track);
            this.currentDuration = duration;
        }else{
            console.log('No se pudo agregar el track ' + track.name + ' debido a que supera el limite de duración de la playlist.')
        }
    }else{
        console.log('El track ' + track.name + ' ya existe en esta playlist.')
    }
}

removeTrack(trackName){

    this.tracks=this.tracks.filter(track=> track.name !== trackName);


}

deleteTracks(tracksArtist){


    tracksArtist.forEach(track => this.removeTrack(track.name));
}


}

module.exports= Playlist;