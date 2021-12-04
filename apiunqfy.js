let express= require('express');        // para importar express
let app= express();                 // para definir nuestra app
let router = express.Router();   
let port = process.env.PORT || 8080; //seteamos los valores del puerto
const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy'); // importamos el modulo unqfy
var bodyParser = require('body-parser')
let errors = require('./apiErrors') //para cargar los errores
let resourceNotFound = new errors.ResourceNotFound()
let relatedNotFound = new errors.RelatedResourceNotFound()
let duplicateResource = new errors.DuplicateResource()
let badRequest = new errors.BadRequest()
const AlbumExistError = require('./albumExistError') //para cargar albumExistError
const Playlist = require('./playlist.js') // para cargar playlist
const sendNotify= require('./Monitor/notifyStatus')
const Observer = require('./observer') //para cargar observer
const ObserverLogging = require ('./observerLogging')
const ObserverNewsletter = require ('./observerNewsletter');



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

  
let unqfy = getUNQfy(); //Instanciamos unqfy
app.use('/api', router);
app.use(express.json())
app.use(express.urlencoded({ extended: true}));
var jsonParser = bodyParser.json();
app.use(errorHandler);


app.listen(port,
    () =>{ console.log ("Server running on 8080 port!");
            sendNotify.sendNotifyUNQfy();
          });



// Rutas invalidas copiar esto en el de apinotis

app.post('*', function(req, res) {
  const not_found = new errors.ResourceNotFound()
  res.status(404)
  res.json({status: not_found.status, errorCode: not_found.errorCode})
});
//rutas invalidas
app.get('*', function(req, res) {
  const not_found = new errors.ResourceNotFound()
  res.status(404)
  res.json({status: not_found.status, errorCode: not_found.errorCode})
});

app.delete('*', function(req, res) {
  const not_found = new errors.ResourceNotFound()
  res.status(404)
  res.json({status: not_found.status, errorCode: not_found.errorCode})
});

app.put('*', function(req, res) {
  const not_found = new errors.ResourceNotFound()
  res.status(404)
  res.json({status: not_found.status, errorCode: not_found.errorCode})
});

app.patch('*', function(req, res) {
  const not_found = new errors.ResourceNotFound()
  res.status(404)
  res.json({status: not_found.status, errorCode: not_found.errorCode})
});

//Manejador de errores Corregido
function errorHandler(err, req, res, next) {

   if (err instanceof SyntaxError) { //json invalida
    const error = new errors.BadRequest()
    res.status(400)
    res.json({status: 400, errorCode: error.errorCode})
    //next();
}
    else  if (err instanceof errors.BadRequest){

    res.status(badRequest.status)
    res.json({
        status: badRequest.status,
        errorCode: badRequest.errorCode
    })
  }
  else if (err instanceof errors.ResourceNotFound){

    res.status(resourceNotFound.status)
    res.json({
        status: resourceNotFound.status,
        errorCode: resourceNotFound.errorCode
  })
  }
  else if(err instanceof errors.DuplicateResource){
    res.status(duplicateResource.status)
    res.json({
       status: duplicateResource.status,
       errorCode: duplicateResource.errorCode  
})
  }
  else if (err instanceof errors.RelatedResourceNotFound){
    res.status(relatedNotFound.status)
    res.json({
      status: relatedNotFound.status,
      errorCode: relatedNotFound.errorCode
            })
            }
            else next(err);
}


//---------------- ARTISTAS -------------//

//Obtener todos los artistas, en caso de que se le pase un nombre como parametro, busca artistas con ese nombre

router.route('/artists').get((req,res)=>{
   if (req.query.name){

    
    let artists = unqfy.searchArtistsByName(req.query.name)
    res.json(artists.map(artist => artist.toJSON()))
    res.status(200)

   }
   else{
     res.json(unqfy.artists.map(artist=> artist.toJSON()));
     res.status(200);
   }
 });
 
 //Obtener un artista segun el ID

 router.route('/artists/:id').get((req, res, next) => {
 try{
  res.status(200);
  let artist = unqfy.getArtistById(req.params.id)
  res.json(artist);
 }
 catch{
        next (new errors.ResourceNotFound()); 
  }
 
 })

 //Agregar un artista

 router.post('/artists', jsonParser, function(req, res, next){

  try{
    checkBodyArtist(req.body)
    let artist = unqfy.addArtist({name: req.body.name , country: req.body.country});

    unqfy.save('data.json')
    res.status(201)
    res.json(artist.toJSON());
  }
  catch(e){
    if (e instanceof errors.BadRequest){
            next (new errors.BadRequest())
     } else{

       next (new errors.DuplicateResource())

}
}
})

 //Eliminar un artista segun su ID

 router.delete('/artists/:id', function(req, res, next){
  try{
    let artist = unqfy.getArtistById(req.params.id)
  unqfy.removeArtist(artist.name)
  res.status(204)
  unqfy.save('data.json')
  res.json("Artist deleted")
  }
  catch(e){
    next (new errors.ResourceNotFound());
}

 });

 //Actualizar artista segun su ID

 router.put('/artists/:id', jsonParser, function(req,res, next){

  try{ 
    let id = req.params.id;
    let artist = unqfy.updateArtist(req.params.id, req.body)
    unqfy.save('data.json')
    res.json(artist.toJSON());
    res.status(200);
  }catch(e){
    next (new errors.ResourceNotFound());
  } 
})


 //---------------------ALBUMES ---------------------------//


//Obtener todos los albumes, en caso de que se le pase un nombre como parametro, busca albums con ese nombre
 router.get('/albums', function(req, res) {
    if(req.query.name){
        let albums = unqfy.searchAlbumsByName(req.query.name)
        res.json(albums.map(album => album.toJSON()));
        res.status(200);
    }else{
        let albums = unqfy.getAllAlbums()
        res.json(albums.map(album => album.toJSON()));
        res.status(200);
    }   

  });


//Obteneer un album segun el ID

router.route('/albums/:id').get((req,res, next)=>{
try{
  
  let album = unqfy.getAlbumById(req.params.id)
  res.json(album.toJSON());
  res.status(200);
  unqfy.save('data.json');
}
catch{

  next (new errors.ResourceNotFound());

}
 });


 ///Agregar un album

 
 router.post('/albums', jsonParser, function(req, res, next){

  try{
    checkBodyAlbum(req.body);
    //let artist = unqfy.getArtistById(req.body.artistId);
    let album = unqfy.addAlbum(req.body.artistId, {name: req.body.name , year: req.body.year});

    unqfy.save('data.json');
    res.status(201);
    res.json(album.toJSON());
  }
  catch(e){
            if(e instanceof errors.BadRequest){
              
                      next(new errors.BadRequest())
                                      } 
            else if(e instanceof AlbumExistError){
              
              next(new errors.DuplicateResource())
                                                }
                  else{
                   
              next(new errors.RelatedResourceNotFound())
              }
            }
          }) 

function checkBodyArtist(body) {
  if (!(body.name && body.country)){

    throw  badRequest;
  }
  
}
function checkBodyAlbum(body){
  if(!(body.artistId && body.name && body.year)){
      throw badRequest;
  }
}
//Actualizar el año de un album segun el ID

router.patch('/albums/:id', jsonParser, function(req,res,next){

  try{ 
    let id = req.params.id;
    let album = unqfy.updateAlbum(req.params.id, req.body.year)
    unqfy.save('data.json')
    res.json(album)
  }catch(e){
        next(new errors.ResourceNotFound())
  } 
})

//Eliminar un album segun el ID
router.delete('/albums/:id', function(req, res, next){
  try{
    let album = unqfy.getAlbumById(req.params.id)
    let artist = unqfy.getArtistById(album.artistID)
    let artistName = artist.name;
    unqfy.removeAlbum(artistName, album.name)
    unqfy.save('data.json')
    res.status(204)
     res.json("Album deleted")
  }
  catch(e){
    next(new errors.ResourceNotFound())
}
 });
 

//Obtener lyrics de un track

router.get('/tracks/:id/lyrics',function(req,res, next){
  let idTrack = req.params.id;
  try{
      let track = unqfy.getTrackById(idTrack)
        if (!track.hasLyrics()){
         let letra = unqfy.getLyricsFromID(idTrack)
         res.status(200)
         letra.then(()=>{
          unqfy.save('data.json');
          res.json({ Name: track.name, lyrics : track.lyrics });
       }).catch((e)=>{
         
          console.log(e.message);
          next (new errors.ResourceNotFound());
  
       })
      } 
      else{
        res.status(200);
        res.json({ Name: track.name, lyrics: track.lyrics });
      } 
  }catch(e){
    next (new errors.ResourceNotFound())
    console.log(e.message);
    
  }
})


//todas las canciones

router.get('/tracks', function(req, res) {

      let tracks = unqfy.getAllTracks()
      res.json(tracks);
      res.status(200);
  }   

);

//agregar cancion 

router.post('/tracks', jsonParser, function(req, res){

  
    
    let track = unqfy.addTrack(req.body.albumId, {name: req.body.name , duration: req.body.duration, genres: req.body.genres});

    unqfy.save('data.json')
    res.status(201);
    res.json(track);
    })

 //obtener una cancion

 router.route('/tracks/:id').get((req,res)=>{
  try{
    
    let track = unqfy.getTrackById(req.params.id)
    res.json(track);
    res.status(200);
    unqfy.save('data.json');
  }
  catch(e){
  
    res.status(resourceNotFound.status)
    res.json({
        status: resourceNotFound.status,
        errorCode: resourceNotFound.errorCode
    })
  
  }
  });


  //------------------PLAYLISTS--------------------



  //Obtener una playlist segun el ID

  router.get('/playlists/:id', function(req, res, next){

    try{
      let id = req.params.id
      let playlist = unqfy.getPlaylistById(id)
      res.status(200)
      res.json(playlist)
  } catch(e){
          next (new errors.ResourceNotFound());
  } 

  })


  //Eliminar una playlist segun el ID

  router.delete('/playlists/:id', function(req, res){


    try{
      const id = req.params.id
      const playlist = unqfy.getPlaylistById(id)
      unqfy.removePlaylist(playlist)
      unqfy.save('data.json')
      res.status(204)
      res.json(playlist)
  }catch(e){
    next (new errors.ResourceNotFound());
  }
  })

///Buscar playlists

router.get('playlists', function(req, res){

if (req.query.name && req.query.durationLT && req.query.durationGT){

  let playlists = unqfy.playlists
  playlists = unqfy.searchPlaylistByName(req.query.name);
  playlists = playlists.filter(playlist => playlist.duration() > durationGT)
  playlists = playlists.filter(playlist => playlist.duration() < durationLT)
  res.json(playlists.map(p=> p.toJSON()));
  res.status(200)

}
    else if (req.query.name || req.query.durationLT || req.query.durationGT){

      let playlists = unqfy.playlists
          if(req.query.name){
            playlists = unqfy.searchPlaylistByName(req.query.name)
          }
          if(durationGT){
          playlists = playlists.filter(playlist => playlist.duration() > durationGT)
          }
          if(durationLT){
          playlists = playlists.filter(playlist => playlist.duration() < durationLT)
          }
          res.json(playlists.map(p=> p.toJSON()))
          res.status(200);
          }
          else {
               res.json(unqfy.playlists.map(p=>p.toJSON()));
               res.status(200);
                } 
})


//Agregar una playlist
router.post('/playlists', jsonParser, function(req,res) {

  if(req.body.genres){

        let playlist = unqfy.createPlaylist(req.body.name, req.body.genres, req.body.maxDuration)
 
        res.status(201)
        res.json(playlist.toJSON())
        unqfy.save('data.json')}

  else {
      let ids = req.body.tracksIds
      try {
          let tracks = ids.map(id=> unqfy.getTrackById(id))
          let maxDuration = 0
          tracks.forEach(track => {
          maxDuration += track.duration()
          });
          let playlist = new Playlist(req.body.name,[],maxDuration)
          playlist.addTracks(tracks)
          unqfy.addPlaylist(playlist)
          unqfy.save('data.json')
          res.status(201)
          res.json(playlist.toJSON())
      } 
      catch(e){
          console.log(e.message)
          next (new errors.ResourceNotFound());
    }
  }

})


router.post('/addObserver', jsonParser, function(req, res, next){

  try{
    let id=req.body.artistId;
    let email= req.body.email;
    unqfy.addObserverToArtist(email, id);
    unqfy.save('data.json')
    res.status(200);
    res.json('');
    
  }
  catch(e){
    if (e instanceof errors.BadRequest){
            next (new errors.BadRequest())
     } else{
      console.log(e);
       next (new errors.DuplicateResource())

}
}
})


router.delete('/removeObserver', jsonParser, function(req, res, next){

  try{
    let id=req.body.artistId;
    let email= req.body.email;
    unqfy.removeObserverFromArtist(id, email);
    unqfy.save('data.json')
    res.status(200);
    res.json('');
    
  }
  catch(e){
    if (e instanceof errors.BadRequest){
            next (new errors.BadRequest())
     } else{
      console.log(e);
       next (new errors.DuplicateResource())

}
}
})


router.delete('/removeAllObserver', jsonParser, function(req, res, next){

  try{
    let id=req.body.artistId;
    unqfy.removeAllObserverFromArtist(id);
    unqfy.save('data.json')
    res.status(200);
    res.json('');
    
  }
  catch(e){
    if (e instanceof errors.BadRequest){
            next (new errors.BadRequest())
     } else{
      console.log(e);
       next (new errors.DuplicateResource())

}
}
})



router.post('/addLogging', jsonParser , function(req,res,next){

try{
    let loggingObserver = new ObserverLogging();
    unqfy.addObserver(loggingObserver);
    res.status(200);
    res.json('Se agrego el logging')

}
catch(e){

    next (new errors.DuplicateResource());
}
})

router.delete('./removeLogging', jsonParser, function (req, res, next){


  try {

    unqfy.removeObserver();
    res.status(200);
    res.json('Se elimino el logging');
  }
  catch {
    next (new errors.ResourceNotFound());
  }


})
  