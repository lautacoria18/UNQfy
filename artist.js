const IdGenerator= require('./idGenerator') // para cargar idGenerator.js
const sendNotify = require('./Notify/notify') //para cargar notify.js

class Artist{
 
    

constructor(artistData, newId){

    if (artistData !== undefined){
    this.name=artistData.name;
    this.country=artistData.country;
    this.id= newId; 
    this.albums= [];
    this.observers= [];
    }
}

addObserver(observer){

  this.observers.push(observer);

}

removeObserver(email){


  this.observers=  this.observers.filter(observer => observer.emailSuscriptor !== email);

}

removeAllObserver(){

  this.observers = [];



}

notifyObservers(albumName){

  let listeners = this.observers;

  if (listeners !== undefined){

  listeners.forEach(listener => listener.notify(this, albumName, "albumArtista"))
  }

}

addNewAlbum(album){

    this.albums.push(album);
    this.notifyObservers(album.name);
    //sendNotify(this, album.name);

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

toJSON() {
  return {
      id: this.id,
      name: this.name,
      albums: this.albums,
      country: this.country,
      observers: this.observers,
  }
}



}
module.exports= Artist;