class IdGenerator {

constructor(){
     this.userId = 0
     this.trackId = 0
     this.playlistId = 0
     this.albumId= 0;
}

getUserId() {
        
        this.userId += 1;
        return this.userId;
    }
 
getTrackId(){


    this.trackId +=1
    return this.trackId;

}

getAlbumId(){

    this.albumId+=1;
    return this.albumId;

}

getPlaylistId(){

    this.playlistId+=1
    return this.playlistId;

}
}

module.exports= IdGenerator;