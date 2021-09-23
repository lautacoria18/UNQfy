![Seminarios visado 1](https://user-images.githubusercontent.com/42523128/134589249-fcb550d2-f5e1-451f-a903-8810070ea719.jpg)



# Instrucciones para el uso de comandos


 --- ARTISTAS

  --- Agregar artista:
   
    - addArtist  'nombreDelArtista' 'paisDeOrigen'    
      Agrega el artista con el nombre 'nombreDelArtista' y su nacionalidad con 'paisDeOrigen'. No se podrá agregar un artista con el mismo nombre, no pueden repetirse.

    - Eliminar artista:

    - removeArtist  'nombreDelArtista'
       Elimina el artista cuyo nombre coincida con el parámetro 'nombreDelArtista'.

  --- Mostrar artistas: 

    - allArtist
       Muestra todos los artistas que hay registrados en el sistema

 --- ALBUMS

  --- Agregar album:    

    - addAlbum 'idArtista' 'nombreDelAlbum' 'añoDelAlbum'
        Agrega el album con nombre 'nombreDelAlbum' al artista cuyo id coincida con 'idArtista'. No se podra agregar un album con el mismo nombre para el mismo artista.
 
  --- Eliminar un album:

    - removeAlbum 'artistName' 'albumName'
       Elimina el album 'albumName' del artista cuyo nombre coincida con 'artistName'

 --- Listar albums:

   - allAlbums
      Muestra los nombres de todos los albums registrados en el sistema

 --- Ver los albums de un artista

   - albumsByArtistName 'artistName'
      Muestra todos los albums del artista del nombre 'artistName'

 --- TRACKS

  --- Agregar un track: 

   - addTrack 'albumId' 'trackName' 'trackDuration' 'trackGenres'
      Agrega un track al album con el id 'albumId' con los respectivos parametros de nommbre 'trackName' duracion 'trackDuration' y una lista de generos 'trackGenres'.

 --- Eliminar un track

   - removeTrack 'trackName' 'artistName'

      Elimina el track 'trackName' del artista 'artistName'. Ademas, se eliminara la cancion de las playlist y albums que lo poseían.
 
  --- Ver los tracks de un album
 
   - getTracksByAlbum 'albumName' 'artistName'
      Muestra todos los tracks del album 'albumName' del artista 'artistName'
  
  --- Ver los tracks de un artista
 
   - tracksByArtistName 'artistName'
      Muestra todos los tracks del artista 'artistName' sin importar a qué album pertenecen.
 
  --- Ver los tracks de un genero
 
   - tracksByGender 'genre'
      Muestra todos los tracks que pertenezcan al género 'genre'
 
 --- BUSCAR POR NOMBRE
  
   - searchByName 'name'
      Muestra todos los resultados que coincidan con el nombre 'name' (artistas, albumes, tracks y playlists).
 
 --- PLAYLIST
  --- Crear playlist:

    - createPlaylist 'name' ['genres'] 'duration'
       Crea una playlist con el nombre 'name' que incluye temas que pertenezcan a los géneros de la lista genres
       La playlist tendrá como máximo la duración indicada en el parámetro 'duration'

