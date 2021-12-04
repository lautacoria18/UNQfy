class ArtistNotExistError extends Error{

    constructor(){

        super("The artist is not registered");
        this.name="ArtistNotExistError"
        
    }


}

module.exports= ArtistNotExistError;