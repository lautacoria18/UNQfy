class Album{

    constructor(albumData, newId){

        if (albumData !== undefined){
        this.name=albumData.name;
        this.year=albumData.year;
        this.tracks= [];
        this.id= newId;
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

}


module.exports= Album;