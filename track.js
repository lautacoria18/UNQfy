class Track{


    constructor(trackData, newId, albumid){
        if (trackData !== undefined){
            this.name= trackData.name;
            this.duration= trackData.duration;
            this.genres= trackData.genres;
            this.id= newId;
            this.timesPlayed= 0;
            this.albumID= albumid;
        }
    }


    hasAtLeastOneGenre(genresN){

        return genresN.some(genre => this.genres.indexOf(genre) >= 0)

    }

    play(){

        this.timesPlayed++;



    }
}



module.exports= Track;