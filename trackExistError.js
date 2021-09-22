class TrackExistError extends Error{ 


    constructor(){
        super("The track is already in the album");
        this.name="TrackExistError";
    }
}

module.exports= TrackExistError;