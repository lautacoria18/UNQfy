class ArtistExistError extends Error{

    constructor(){

        super("The artist is already registered");
        this.name="ArtistExistError"
        
    }


}

module.exports= ArtistExistError;