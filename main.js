

const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqfy = require('./unqfy');
const unqmod = require('./unqfy'); // importamos el modulo unqfy

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy(filename = 'data.json') {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

function saveUNQfy(unqfy, filename = 'data.json') {
  unqfy.save(filename);
}

/*
 En esta funcion deberán interpretar los argumentos pasado por linea de comandos
 e implementar los diferentes comandos.

  Se deberán implementar los comandos:
    - Alta y baja de Artista  listo
    - Alta y Baja de Albums   listo
    - Alta y Baja de tracks listo

    - Listar todos los Artistas listo
    - Listar todos los albumes de un artista listo
    - Listar todos los tracks de un album listo

    - Busqueda de canciones intepretadas por un determinado artista listo 
    - Busqueda de canciones por genero listo

    - Dado un string, imprimmir todas las entidades (artistas, albums, tracks, playlists) que coincidan parcialmente
    con el string pasado. Listo

    - Dada un nombre de playlist, una lista de generos y una duración máxima, crear una playlist que contenga
    tracks que tengan canciones con esos generos y que tenga como duración máxima la pasada por parámetro. listo

  La implementacion de los comandos deberá ser de la forma:
   1. Obtener argumentos de linea de comando
   2. Obtener instancia de UNQfy (getUNQFy)
   3. Ejecutar el comando correspondiente en Unqfy
   4. Guardar el estado de UNQfy (saveUNQfy)

*/

function handleError(e){
  console.log(e.message)
}


function addArtist(unqfy, name, country) {

  try {
      unqfy.addArtist({name,country});
  }
  catch(e) {
    if(e.name === 'ArtistExistError'){
      handleError(e)
    }else{
      throw e
    }
  }
  saveUNQfy(unqfy)
}

function addAlbum(unqfy,id,albumName,albumYear){


    unqfy.addAlbum(id,{name:albumName,year:parseInt(albumYear)})

  saveUNQfy(unqfy)
}


function allArtist(unqfy){
  
  console.log(unqfy.artists)
}

function allAlbums(unqfy){
  
  console.log(unqfy.getAllAlbums());
}


function removeArtist(unqfy,artistName){
 
    unqfy.removeArtist(artistName)

  
  saveUNQfy(unqfy)
}

function createPlaylist(unqfy,name,genresToInclude, maxDuration){
  
  unqfy.createPlaylist(name,genresToInclude,maxDuration)
  saveUNQfy(unqfy)
}


function removeAlbum(unqfy,artistName,albumName){
 
  
    unqfy.removeAlbum(artistName,albumName)
  
  
  saveUNQfy(unqfy)
}

function tracksByArtistName(unqfy,artistName){

  try{
    console.log(unqfy.getTracksMatchingArtist(artistName))
  }catch(e) {
    if(e.name === 'ArtistExistError'){
      handleError(e)
    }else{
      throw e
    }
  }
}

function tracksByGender(unqfy,genre){


  console.log(unqfy.getTracksMatchingGenres([genre]));
}

function searchByName(unqfy,name){

  console.log(unqfy.searchByName(name))
}

function albumsByArtistName(unqfy,artistName){

  console.log(unqfy.getAlbumsByArtistName(artistName))
}

function addTrack(unqfy,idAlbum,trackName,trackDuration,trackGenre){

  try{
    unqfy.addTrack(idAlbum,{name:trackName,duration:parseInt(trackDuration),genres:trackGenre});
  }
  catch(e){
    if(e.name ==="TrackExistError" ){
      handleError(e)
    }
    else{
      throw e
    }
  }
    saveUNQfy(unqfy)
}

function removeTrack(unqfy,trackName,artistName){


    unqfy.removeTrack(trackName,artistName)

  saveUNQfy(unqfy)
}

function getTracksByAlbum(unqfy,albumid){

  console.log(unqfy.getTracksByAlbum(albumid))
}

function getPlaylists(unqfy){

  console.log(unqfy.playlists)
}
function main() {
  console.log('arguments: ');
  process.argv.forEach(argument => console.log(argument));
  const arguments_ = process.argv.slice(2);
  const unqfy =getUNQfy(); 
  const commandName = arguments_[0]

  if (commandName == "addArtist"){
     return addArtist(unqfy, arguments_[1], arguments_[2]);
  }
  if(commandName == 'allArtist'){
   return allArtist(unqfy)
  }
  if(commandName == 'addAlbum'){

    return addAlbum(unqfy,arguments_[1],arguments_[2],arguments_[3]);
  }
  if(commandName == 'allAlbums'){

    return allAlbums(unqfy);
  }

  if(commandName == 'removeArtist'){

    return removeArtist(unqfy,arguments_[1]);
  }
  if (commandName == 'createPlaylist'){

    return createPlaylist(unqfy,arguments_[1], arguments_.slice(2), arguments_[3]);
  }

  if(commandName == 'removeAlbum'){
    return removeAlbum(unqfy,arguments_[1], arguments_[2]);
  }
  if (commandName == 'tracksByArtistName'){

    return tracksByArtistName(unqfy,arguments_[1]);
  }
  if(commandName == 'tracksByGender'){
    return tracksByGender(unqfy,arguments_[1]);
  }
  if(commandName == 'searchByName'){

    return searchByName(unqfy,arguments_[1]);
  }
  if (commandName == 'albumsByArtistName'){

    return albumsByArtistName(unqfy,arguments_[1]);
  }
  if (commandName == 'addTrack'){

    return addTrack(unqfy,arguments_[1], arguments_[2], arguments_[3], arguments_[4]);
  }
  if (commandName == 'removeTrack'){

    return removeTrack(unqfy,arguments_[1], arguments_[2]);
  }

  if(commandName == 'getTracksByAlbum'){

    return getTracksByAlbum(unqfy,arguments_[1]);
  }
  if(commandName == 'getPlaylists'){

    return getPlaylists(unqfy);
  }

  

  saveUNQfy;
}

main();
////sda