class AlbumNotExistError extends Error{

    constructor(){

        super("The album is not registered");
        this.name="AlbumNotExistError"
        
    }


}

module.exports= AlbumNotExistError;