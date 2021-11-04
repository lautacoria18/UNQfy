class User{


    constructor(){

        this.songsListened = new Map();

    }

playATrack(track){

    if (this.songsListened.has(track.name)){

        let timesListened= this.songsListened.get(track.name)
        this.songsListened.set(track.name, timesListened + 1);
        track.play();

    }
    else{
        this.songsListened.set(track.name, 1);
    }

}

getListenedTracks(){

    return Array.from( this.songsListened.keys() );

}

timesPlayed(track){

return this.songsListened.get(track.name);
}


    
}