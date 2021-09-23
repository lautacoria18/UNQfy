
const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const Artist= require('./artist') // para cargar artist.js
const Album= require('./album') // para cargar artist.js
const Track= require('./track') // para cargar track.js
const Playlist= require('./playlist') // para  cargar playlist.js
const IdGenerator= require('./idGenerator') //para cargar idGenerator.js
const ArtistExistError= require('./artistExistError') // para cargar artistExistError
const TrackExistError= require('./trackExistError') // para cargar trackExistError


class UNQfy {


  constructor(){

    this.artists= [];
    this.playlists=[];
    this.idGenerator= new IdGenerator();
  }

  addArtist(artistData) {

    if (!this.artistExist(artistData.name)){

      const artist= new Artist(artistData, this.idGenerator.getUserId());
      this.artists.push(artist);
      return(artist);
      console.log("The new artist " + artist.name + " has registered with succes!.");
    }
    else{
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
      const album= new Album(albumData, this.idGenerator.getAlbumId());

      artist.addNewAlbum(album);
      return album;
      console.log("The new album " + album.name + " has registered with succes!."); 
    }
  }
   else{
    throw Error('The artist is not registered');
   }
    }
  


  // trackData: objeto JS con los datos necesarios para crear un track
  //   trackData.name (string)
  //   trackData.duration (number)
  //   trackData.genres (lista de strings)
  // retorna: el nuevo track creado
  addTrack(albumId, trackData) {
    let album= this.getAlbumById(albumId);

    if(album !== undefined){
      if(!album.existTrack(trackData.name)){
        let track= new Track(trackData, this.idGenerator.getTrackId(), albumId);
        album.addNewTrack(track);
        return track;
        console.log("The new song " + track.name + " has registered with succes!.");
                                          }
      else{
        throw new TrackExistError();
    }
  }
    else{

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
      console.log("There is no artist with that ID")
    }
  }


  getAlbumById(id) {
    // Retorna al album con el id indicado, si es que existe
    let albumes = this.getAllAlbums()
    let album = albumes.find(album => album.id == id)
    if(album !== undefined){
      return album
    }else{
      console.log ("There is no album with that ID");
    }

  }

  getTrackById(id) {

    let tracks= this.getAllTracks()
    let track = tracks.find(track => track.id === id)
    if (track !== undefined){
    return track;
    }
    else{
      console.log("There is no track with that ID");
    }
  }

  getPlaylistById(id) {


    let playlist= this.playlists.find(pl => pl.id === id);
    if (playlist !== undefined){
    return playlist;
    }
    else{
      console.log("There is no playlist with that ID");
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
          throw new ArtistExistError();
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

    let totalTracks=[];

    this.getAllAlbums().forEach(album => totalTracks= totalTracks.concat(album.tracks));

    return totalTracks;
  }

  searchByName(word){

    let tracks= this.searchTracksByName(word);
    let artists= this.searchArtistsByName(word);
    let playlists= this.searchPlaylistsByName(word);
    let albums= this.searchAlbumsByName(word);


    return {tracks, artists, playlists, albums}
  

  }

  searchAlbumsByName(word){

    let albums = this.getAllAlbums().filter(album => album.name.includes(word));

    return albums;
  }

  searchArtistsByName(word){

    let artists= this.artists.filter(artist=> artist.name.includes(word));

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
        this.playlists.forEach(playlist => playlist.removeTrack(trackName));  //listo
        console.log('The track ' + trackName + ' has been deleted!');
      }else{
        throw Error('The track is not registered');
      }
    }
  }


  removeArtist(artistName){

    if (this.artistExist(artistName)){

      this.artists= this.artists.filter(artist => artist.name !== artistName);
      this.playlists.forEach(playlist => playlist.deleteTracks(this.getTracksMatchingArtist(artistName)));
      console.log('The artist ' + artistName + ' has been deleted!');
    }
    else{
      throw Error('The artist is not registered!'); //ok
    }


  }

  removeAlbum(artistName, albumName){

    let artist= this.getArtistByName(artistName);
    if(artist !== undefined){

      let album = artist.albums.find(album => album.name === albumName)
        if (album !== undefined){

          artist.removeAlbum(albumName); //listo
          album.tracks.forEach(track => this.removeTrack(artistName, track.name));
          console.log('The album '+ albumName + ' has been deleted!')
          
        }
        else {

          throw Error ('The album is not registered!')
        }



    }

  }

  removePlaylist(id){

    let playlist = this.getPlaylistById(id);
    if(playlist !== undefined){
      this.playlists = this.playlists.filter(playlist => playlist.id !== id)
      console.log('The playlist ' + playlist.name + ' has been deleted!');
    }else{
      throw Error('The playlist is not registered'); 
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

