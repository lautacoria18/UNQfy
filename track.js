const rp = require('request-promise') // para cargar los request
class Track{


    constructor(trackData, newId, albumid,artistName){
        if (trackData !== undefined){
            this.name= trackData.name;
            this.duration= trackData.duration;
            this.id= newId;
            this.genres= trackData.genres; 
            this.timesPlayed= 0;
            this.albumID= albumid;
            this.lyrics='';
            this.artist= artistName;
        }
    }


    hasAtLeastOneGenre(genresN){

        return genresN.some(genre => this.genres.indexOf(genre) >= 0)

    }

    play(){

        this.timesPlayed++;



    }

    getLyrics(){
        if(this.lyrics != ""){
            return this.lyrics;
        }else{
            return this.getTrackIdFromMatchXMusic(this.name);
        }
    }

    hasLyrics(){
        return this.lyrics !== "";
    }
    getTrackIdFromMatchXMusic(trackName){
        const rp = require('request-promise')
        const URLF=  'http://api.musixmatch.com/ws/1.1';
        let options = {
            uri: URLF + '/track.search',
            qs:{
                apikey : 'a5b3a38042db3d9808ac8c9ff55e59ea',
                q_track : trackName,
                q_artist: this.artist,
            },
            json: true
       };
       return rp.get(options).then((response)=> {
        let body = response.message.body;
        if (body.track_list.length > 0) {
            
            let trackId = body.track_list[0].track.track_id;
            //return trackId;
            console.log(trackId);
            return this.getLyricsFromId(trackId);
            //return "Letra random";
        }
    }).catch ((e) =>{
        throw new Error('There is no track with name ' + trackName + ' in MusixMatch'); 
    })

    }


    getLyricsFromId(id){
        const rp = require('request-promise')

        const URLF=  'http://api.musixmatch.com/ws/1.1'
        let options = {
            uri: URLF + '/track.lyrics.get',
            qs:{
                apikey : 'a5b3a38042db3d9808ac8c9ff55e59ea',
                track_id : id,
            },
            json: true
       }
        
        return rp.get(options).then((response)=>{
        let body = response.message.body;
        let lyricsOfTrack = body.lyrics.lyrics_body;
        this.lyrics = lyricsOfTrack;
        return this.lyrics;
    }).catch((e)=>{
        throw new Error('There is no track with name' + this.name + ' en MusixMatch' + id); 
    })
}
}






module.exports= Track;