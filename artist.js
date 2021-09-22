const IdGenerator= require('./idGenerator') // para cargar track.js
class Artist{
 
    

constructor(artistData, newId){

    if (artistData !== undefined){
    this.name=artistData.name;
    this.country=artistData.country;
    this.id= newId; //estaba el 12
    this.albums= [];
    }
}

addNewAlbum(album){

    this.albums.push(album);

}

removeAlbum(albumName){

  this.albums=  this.albums.filter(album => album.name !== albumName);
}

getTracks(){ //este metodo no deberia estar aca

    
    let totalTracks=[];

    this.albums.forEach(album => totalTracks= totalTracks.concat(album.tracks));

    //return this.albums.map(album => album.tracks).reduce((a,b) => {
      //  return a.concat(b)
      //})

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