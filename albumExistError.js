class AlbumExistError extends Error{

    constructor(){

        super("The album is already registered in the artist");
        this.name="AlbumExistError"
        
    }


}

module.exports= AlbumExistError;