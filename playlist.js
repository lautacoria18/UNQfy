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
        let cDuration = this.duration() + track.duration;
        if(cDuration <= this.maxDuration){
            this.tracks.push(track);
            this.currentDuration = cDuration;
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

deleteTracks(tracks){


    tracks.forEach(track => this.removeTrack(track.name));
}

addTracks(tracks){

    for(let track of tracks){
        this.addTrack(track)
     }
}
toJSON(){
    return ({
       id: this.id,
       name: this.name,
       duration: this.duration(),
       tracks: this.tracks
    })
 }


}

module.exports= Playlist;