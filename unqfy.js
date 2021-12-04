const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const Artist= require('./artist') // para cargar artist.js
const Album= require('./album') // para cargar artist.js
const Track= require('./track') // para cargar track.js
const Playlist= require('./playlist') // para  cargar playlist.js
const IdGenerator= require('./idGenerator') //para cargar idGenerator.js
const ArtistExistError= require('./artistExistError') // para cargar artistExistError
const TrackExistError= require('./trackExistError') // para cargar trackExistError
const ArtistNotExistError = require('./artistNotExistError') // para cargar artistNotExistError
const AlbumExistError = require('./albumExistError') //para cargar albumExistError
const AlbumNotExistError = require('./albumNotExistError') // para cargar albumNotExistError
const rp = require('request-promise') // para cargar los request
const sendNotify = require('./Logging/notifyLogging') //para cargar el notifyLogging
const Observer = require('./observer') //para cargar observer
const ObserverLogging = require ('./observerLogging')
const ObserverNewsletter = require ('./observerNewsletter');
class UNQfy {


  constructor(){

    this.artists= [];
    this.playlists=[];
    this.idGenerator= new IdGenerator();
    this.observers= [];
  }

  addObserver(observer){

    this.observers.push(observer);

  }

  removeObserver(){
    this.observers = [];
  }



  notifyObservers(objeto, name, evento){

    let listeners = this.observers;
  
    if (listeners !== undefined){
  
    listeners.forEach(listener => listener.notify(objeto, name, evento));
    }
  
  }


  removeObserverFromArtist(artistID, email){

    let artist= this.getArtistById(artistID);

    if (artist !== undefined){

      console.log("hola");
    artist.removeObserver(email);
    
    }

  }

  addObserverToArtist(email, id){

    let newObserver = new ObserverNewsletter(email);
    let artist=this.getArtistById(id);

    if (artist !== undefined){
    artist.addObserver(newObserver);
    }
  }

  removeObserverFromArtist(artistID, email){

    let artist= this.getArtistById(artistID);

    if (artist !== undefined){

      console.log("hola");
    artist.removeObserver(email);
    
    }

  }

  removeAllObserverFromArtist(artistID){

    let artist= this.getArtistById(artistID);

    if (artist !== undefined){

      console.log("hola");
    artist.removeAllObserver();
    
    
    }

    }



 
  addArtist(artistData) {

    if (!this.artistExist(artistData.name)){

      const artist= new Artist(artistData, this.idGenerator.getUserId());
      this.artists.push(artist);
      console.log("The new artist " + artist.name + " has registered with succes!.");
      this.notifyObservers(artist, '', 'artistaNuevo');
      return(artist);

    }
    else{
      this.notifyObservers(artistData, '', 'errorArtistaExiste');
      throw new ArtistExistError(); 
   }
  }

  artistExist(artistName){

    return this.artists.some(artist => artist.name == artistName);

  }

  addAlbum(artistId, albumData) {
    const artist= this.getArtistById(artistId);   

    if (artist !== undefined){
      if(!artist.existAlbum(albumData.name)){
      const album= new Album(albumData, this.idGenerator.getAlbumId(), artistId);

      artist.addNewAlbum(album);
      console.log("The new album " + album.name + " has registered with succes!."); 
      this.notifyObservers(album, artist.name, 'albumNuevo');
      return (album);

    }
    else {
          this.notifyObservers(albumData, '', 'errorAlbumExiste');
          throw new AlbumExistError();
    }
  }
   else{
    this.notifyObservers(albumData, '', 'errorArtistaNoExiste');
    throw new ArtistNotExistError();
   }
    }
  


  // trackData: objeto JS con los datos necesarios para crear un track
  //   trackData.name (string)
  //   trackData.duration (number)
  //   trackData.genres (lista de strings)
  // retorna: el nuevo track creado
  addTrack(albumId, trackData) {
    let album= this.getAlbumById(albumId);
    let artistOfTrackId= album.artistID;
    let artistOfTrack= this.getArtistById(artistOfTrackId);
    let artistName= artistOfTrack.name;
    if(album !== undefined){
      if(!album.existTrack(trackData.name)){
        let track= new Track(trackData, this.idGenerator.getTrackId(), albumId, artistName);
        album.addNewTrack(track);
        console.log("The new song " + track.name + " has registered with succes!.");
        this.notifyObservers(track, album.name, 'trackNuevo');
        return track;
        
                                          }
      else{
        this.notifyObservers(trackData, '', 'errorTrackExiste');
        throw new TrackExistError();
    }
  }
    else{
      this.notifyObservers(trackData, '', 'errorAlbumNoExiste');
      console.log("The album is not registered in the system!")
    }
  /* Crea un track y lo agrega al album con id albumId.
  El objeto track creado debe tener (al menos):
      - una propiedad name (string),
      - una propiedad duration (number),
      - una propiedad genres (lista de strings)
  */
  }

  getArtistById(id) {

    let artist= this.artists.find(artist => artist.id== id);
    if (artist !== undefined){
      return artist;
    }
    else{
      //throw Error;

      //error de artista que no existe
      //console.log("There is no artist with that ID" + id)
    }
  }


  getAlbumById(id) {
    // Retorna al album con el id indicado, si es que existe
    let albumes = this.getAllAlbums()
    let album = albumes.find(album => album.id == id)
    if(album !== undefined){
      return album
    }else{

      throw new AlbumNotExistError();
    }

  }

  getTrackById(idG) {

    let tracks= this.getAllTracks(); //esta aca el problema?
    let trackSelected = tracks.find(track => track.id == idG);
    if (trackSelected !== undefined){
    return trackSelected;
    }
    else{
      throw Error("There is no track with that ID: " + idG);
    }
  }

  getPlaylistById(id) {


    let playlist= this.playlists.find(pl => pl.id === id);
    if (playlist !== undefined){
    return playlist;
    }
    else{
      console.log("There is no playlist with that ID: " + id);
    }
  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {
   
    let allTracks = this.getAllTracks();
    let tracks = allTracks.filter(track => track.hasAtLeastOneGenre(genres));
    return tracks;
  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {
    if (this.artistExist(artistName)){

      return this.getArtistByName(artistName).getTracks(); 
        }
        else {
          //throw new ArtistExistError();
        }

  }

  getArtistByName(artistName){

    let artists= this.artists;
    let artist= artists.find(artist => artist.name === artistName);
    if (artist !== undefined){
    return artist;
    }
    else{
      console.log("There is no artist with that name");
    }
  }


  // name: nombre de la playlist
  // genresToInclude: array de generos
  // maxDuration: duración en segundos
  // retorna: la nueva playlist creada
  createPlaylist(name, genresToInclude, maxDuration) {
  /*** Crea una playlist y la agrega a unqfy. ***
    El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist.
      
  */
    let playlist = new Playlist({playlistName : name, genres: genresToInclude, duration:  maxDuration}, this.idGenerator.getPlaylistId());
    let tracks = this.getTracksMatchingGenres(genresToInclude);
    tracks.forEach(track => playlist.addTrack(track));
    this.playlists.push(playlist);

    return playlist;
  }

  getAllAlbums(){

    return this.artists.map(artist => artist.albums).reduce((a,b) => {
      return a.concat(b)
    })
  }

  getAllTracks() {

    //return this.getAllAlbums()[0].tracks
    return this.getAllAlbums().map(album => album.tracks).reduce((a,b) =>{
      return a.concat(b)
    })
  }

  searchByName(word){

    let tracks= this.searchTracksByName(word);
    let artists= this.searchArtistsByName(word);
    let playlists= this.searchPlaylistsByName(word);
    let albums= this.searchAlbumsByName(word);


    return {tracks, artists, playlists, albums}
  

  }

  searchAlbumsByName(word){

    let albums = this.getAllAlbums().filter(album => album.name.toLowerCase().includes(word));

    return albums;
  }

  searchArtistsByName(word){

    let artists= this.artists.filter(artist=> artist.name.toLowerCase().includes(word));

    return artists;

  }
  searchPlaylistsByName(word){

    let playlists= this.playlists.filter(playlist=> playlist.name.includes(word));

    return playlists;

  }

  searchTracksByName(word){

    let tracks= this.getAllTracks().filter(track=> track.name.includes(word));
    return tracks;
  }
  removeTrack(trackName, artistName){
    let artist = this.getArtistByName(artistName);
    if(artist !== undefined){
      let album = artist.findAlbumWithTrackName(trackName);
      if(album !== undefined){
        album.removeTrack(trackName);
        this.playlists.forEach(playlist => playlist.removeTrack(trackName)); 
        console.log('The track ' + trackName + ' has been deleted!');
        this.notifyObservers(album, trackName, 'trackEliminado');
      }else{
        console.log('The track is not registered');
        this.notifyObservers(null, trackName, 'errorTrackEliminado');
      }
    }
  }


  removeArtist(artistName){


    if (this.artistExist(artistName)){
      let artist = this.getArtistByName(artistName);
      this.artists= this.artists.filter(artist => artist.name !== artistName);
      this.playlists.forEach(playlist => playlist.deleteTracks(this.getTracksMatchingArtist(artistName)));
      console.log('The artist ' + artistName + ' has been deleted!');
      this.notifyObservers(artist.name, '', 'artistaEliminado');
    }
    else{
     console.log('The artist is not registered!'); //ok
     this.notifyObservers(null, artistName, 'errorArtistaEliminado');
    }


  }

  removeAlbum(artistName, albumName){

    let artist= this.getArtistByName(artistName);
    if(artist !== undefined){

      let album = artist.albums.find(album => album.name === albumName)
        if (album !== undefined){

          artist.removeAlbum(albumName); //listo
          this.playlists.map(playlist => playlist.deleteTracks(album.tracks))
          console.log('The album '+ albumName + ' has been deleted!');
          this.notifyObservers(album.name, '', 'albumEliminado');
          
        }
        else {
          this.notifyObservers(null, albumName, 'errorAlbumEliminado');
         throw console.error("algo salio mal");
        }



    }

  }

  removePlaylist(id){

    let playlist = this.getPlaylistById(id);
    if(playlist !== undefined){
      this.playlists = this.playlists.filter(playlist => playlist.id !== id)
      console.log('The playlist ' + playlist.name + ' has been deleted!');
    }else{
      console.log('The playlist is not registered'); 
    }
  }

getMostImportantPlaylist(artist){

let allSongsFromArtist= this.getTracksMatchingArtist(artist.name);

 let songsMostPlayed = allSongsFromArtist.sort((a, b) => b.timesPlayed - a.timesPlayed);

 let threeMostPlayed= songsMostPlayed.slice(0,4);

 return threeMostPlayed;

 }

 getAlbumsByArtistName(artistName){

  let artist= this.getArtistByName(artistName);

  return artist.albums;
 }

 getTracksByAlbum(albumId){

  let album= this.getAlbumById(albumId);

  return album.tracks;

 }


 //Visado 2


 populateAlbumsForArtist(artistName){

  const options = {
    url: 'https://api.spotify.com/v1/search', //endpoint
    headers: { Authorization: 'Bearer ' +
     'BQB1DbNKKXYla_da_6k_VMGoH7uDLXaWO5xiGSr_eHZHk4dqHk2JDzt0fJaED9VvPVELbdltVxlGZlk-y_2jWvKx8xTv3JLwFazyOhRxQNaJo9jP_G_Fc3prQueQGaaDLCNu1xKxFs3HvVyLp0er-c_Ec3RVK7-G' }, //el token que tengo en las credenciales
    json: true, 
    qs: {
      q: artistName, //la clave artista
      limit: 1, //Limite de 1
      type: 'artist' //el tipo que tengo que buscar
    }
};
rp.get(options).then((response) => { 
  let idFromArtistName= response.artists.items[0].id;
  console.log('This is the ID: ' + idFromArtistName + ' from the artist ' + artistName);
  this.syncronizeAlbumsForArtist(artistName, idFromArtistName); 
 })

 }

 syncronizeAlbumsForArtist(artistName, artistIDSpotify){

  const options = {
    url: 'https://api.spotify.com/v1/artists/'+ artistIDSpotify + '/albums',
    headers: { Authorization: 'Bearer ' +
    'BQB1DbNKKXYla_da_6k_VMGoH7uDLXaWO5xiGSr_eHZHk4dqHk2JDzt0fJaED9VvPVELbdltVxlGZlk-y_2jWvKx8xTv3JLwFazyOhRxQNaJo9jP_G_Fc3prQueQGaaDLCNu1xKxFs3HvVyLp0er-c_Ec3RVK7-G' },
    json: true
  }
  rp.get(options).then((response)=>{
    let albums = [...new Set(response.items)] 
    this.addAlbumsToArtist(artistName,albums);
  })
 }

 addAlbumsToArtist(artistName,albums){
  
  let artist= this.getArtistByName(artistName);

  if (artist !== undefined){


      albums.map(album => artist.addNewAlbum(new Album({name:album.name, year: album.release_date.slice(0,4)}, this.idGenerator.getAlbumId())));
      console.log('Se agregaron los albumes al artista con exito')

  }
  else{

    console.log('Hubo un error'); //modificar esto
  }
}

updateArtist(artistId,artistData){

let artist=  this.getArtistById(artistId);

if (artist !== undefined){

  artist.name= artistData.name;
  artist.country= artistData.country;
  console.log('The artist has been update succesfully!')
  return artist;
  

}


}


updateAlbum(albumID, albumYear){

    let album= this.getAlbumById(albumID);

    if (album !== undefined){

      album.year= albumYear;
      console.log('The year of the album has been updated succesfully!')
      return album;
    }


}

getLyricsFromID(trackID){


  let track = this.getTrackById(trackID);

  return track.getLyrics();

}

addPlaylist(playlist){

  this.playlists.push(playlist);
}

  save(filename) {
    const serializedData = picklify.picklify(this);
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artist, Album, Track, Playlist, ArtistExistError, TrackExistError, IdGenerator];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy: UNQfy,
  Artist: Artist,
  Playlist: Playlist,
  Track: Track,
  Album: Album,
  ArtistExistError: ArtistExistError,
  //TrackExistInAlbumError: TrackExistInAlbumError  
};

