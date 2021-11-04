class Album{

    constructor(albumData, newId, artistid){

        if (albumData !== undefined){
        this.name=albumData.name;
        this.year=albumData.year;
        this.tracks= [];
        this.id= newId;
        this.artistID= artistid
        }
    }

existTrack(trackName){

    return this.tracks.some(track => track.name == trackName)


}

addNewTrack(track){
    this.tracks.push(track);
}

removeTrack(trackName){
    this.tracks=this.tracks.filter(track=> track.name !== trackName);
}

toJSON(){
    return {
        id: this.id,
        name: this.name,
        year: this.year,
        tracks: this.tracks
    }
}

}


module.exports= Album;