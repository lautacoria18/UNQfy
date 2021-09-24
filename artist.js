const IdGenerator= require('./idGenerator') // para cargar idGenerator.js
class Artist{
 
    

constructor(artistData, newId){

    if (artistData !== undefined){
    this.name=artistData.name;
    this.country=artistData.country;
    this.id= newId; 
    this.albums= [];
    }
}

addNewAlbum(album){

    this.albums.push(album);

}

removeAlbum(albumName){

  this.albums=  this.albums.filter(album => album.name !== albumName);
}

getTracks(){ 

    
    let totalTracks=[];

    this.albums.forEach(album => totalTracks= totalTracks.concat(album.tracks));



    return totalTracks;
}

existAlbum(albumName){

    return this.albums.some(album=> album.name === albumName);
}

findAlbumWithTrackName(trackName){

  return this.albums.find(album => album.existTrack(trackName));
}



}
module.exports= Artist;