class APIError extends Error {
    constructor(name, statusCode, errorCode, message = null) {
      super(message || name);
      this.name = name;
      this.status = statusCode;
      this.errorCode = errorCode;
    }

    toJSON(){
        return {
            status:this.status,
            errorCode: this.errorCode
        }
    }
 }
 
 class DuplicateResource extends APIError {
    constructor(){
        super('Error: duplicate Entitie',409,"RESOURCE_ALREADY_EXISTS")
    }
 }

 class RelatedResourceNotFound extends APIError{
     constructor(){
         super('Error: related resource not found', 404, "RELATED_RESOURCE_NOT_FOUND");
     }
 }


 class ResourceNotFound extends APIError{

    constructor(){
        super('Error: resource not found', 404, "RESOURCE_NOT_FOUND");
    }
 }

 class BadRequest extends APIError{
     constructor(){
        super('Error: bad request', 400, "BAD_REQUEST")

     }
 }

 class Unexpected extends APIError{
     constructor(){
         super('Error: unexpected error!', 500, "INTERNAL_SERVER_ERROR")
 }
 
 }


 module.exports = {
    DuplicateResource,
    RelatedResourceNotFound,
    ResourceNotFound,
    BadRequest,
    Unexpected
  };