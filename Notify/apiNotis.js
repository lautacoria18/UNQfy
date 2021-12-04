let express= require('express');        // para importar express
let app= express();                 // para definir nuestra app
let router = express.Router();   
let port = process.env.PORT || 8081; //seteamos los valores del puerto
const fetch = require('node-fetch'); //luego debo instalarlo
app.use('/api', router);
app.use(express.json())
app.use(express.urlencoded({ extended: true}));
app.use(errorHandler);
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const sendNotify= require ('../Monitor/notifyStatus')
const GMailAPIClient = require('./GMailAPIClient');
//Errores
let errors = require('../apiErrors');
let relatedResourceNotFound = new errors.RelatedResourceNotFound();
let resourceNotFound=  new errors.ResourceNotFound();


//Manejador de errores

app.post('*', function(req, res) {
    const not_found = new errors.ResourceNotFound()
    res.status(404)
    res.json({status: not_found.status, errorCode: not_found.errorCode})
  });
  
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


function errorHandler(err, req, res, next) {

    if (err instanceof SyntaxError) { //ruta invalida
     const error = new errors.BadRequest()
     res.status(400)
     res.json({status: 400, errorCode: error.errorCode})
     next();
 }
     else  if (err instanceof errors.RelatedResourceNotFound){
 
     res.status(relatedResourceNotFound.status)
     res.json({
         status: relatedResourceNotFound.status,
         errorCode: relatedResourceNotFound.errorCode
     })
   }
}


//Map para las suscripciones
let subscriptions = new Map();


app.listen(port,
    () =>{ console.log ("Server running on 8081 port!")
            sendNotify.sendNotifyNewsletter()
        });


//Chequear si el artista existe para podes suscribir, desuscribirse y notificar

function checkArtist(artistID){
        return fetch('http://localhost:8080/api/artists/' + artistID, {
            method: 'GET', 
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
        }

function addObserver(id, emailx){

return fetch ('http://localhost:8080/api/addObserver',{
            method : 'post',
            body :  JSON.stringify({
                        artistId: id,
                        email: emailx,
            }),
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
}

function deleteObserver(id, emailx){

    return fetch ('http://localhost:8080/api/removeObserver',{
                method : 'delete',
                body :  JSON.stringify({
                            artistId: id,
                            email: emailx,
                }),
                headers:{
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
    }

function deleteAllObservers(id){

    return fetch ('http://localhost:8080/api/removeAllObserver',{
        method : 'delete',
        body :  JSON.stringify({
                    artistId: id,
                
        }),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
}




//Suscribirse a un artista        

function subscribeToArtist(artistID, email){

        let subMails = subscriptions.get(artistID);
    
        if(subMails){
            subMails.push(email);
            subscriptions = subscriptions.set(artistID,subMails)
        } else {
            subscriptions = subscriptions.set(artistID, [email])
        }
    
        console.log('Subscriptions : ', subscriptions.get(artistID));
        return subscriptions;
    }

   
    router.post('/subscribe', jsonParser, function(req,res, next){
        let artistID = parseInt(req.body.artistID);
        checkArtist(artistID).then(response =>{
                if(!response.status) {
                    addObserver(artistID, req.body.email);
                    subscribeToArtist(artistID, req.body.email);
                    res.status(200);
                    res.json('')
                } else{
                    next (new errors.RelatedResourceNotFound());
                }        
        }).catch(error=>{
            next (new errors.RelatedResourceNotFound());
             console.log('Error: ', error);
        })
    
    });

//Desuscribir a un artista
    
    function desubscribeToArtist(artistID, email){
        let subMails = subscriptions.get(artistID);
        if(subMails && subMails.includes(email)){
            let newEmails = subMails.filter(emails => emails != email);
            subscriptions = subscriptions.set(artistID,newEmails);
        }
    }

    router.post('/unsubscribe', jsonParser, function(req,res, next){
        let artistID = parseInt(req.body.artistID);
        checkArtist(artistID).then(response =>{
            if(!response.status){
               deleteObserver(artistID, req.body.email);
               desubscribeToArtist(artistID, req.body.email);
               res.status(200);
               res.json('')
            }else{
                next (new errors.RelatedResourceNotFound());
            }
        })
        .catch(error=>{
            next (new errors.RelatedResourceNotFound());
            console.log('error: ',error);
       })
    })
    
//Obtener todos los emails suscritos a un artista

router.route('/subscriptions').get((req,res, next)=>{
    let id = parseInt(req.query.artistId);
    let subMails = subscriptions.get(id);
    checkArtist(id)
          .then(response => {
              if(!response.status){
                
                res.status(200);
                console.log(subscriptions);
                console.log(subMails);
                res.json({artistId:id, subscriptors:subMails})
              }
            else{
                next (new errors.RelatedResourceNotFound());
              }
          }).catch(error=>{
            next (new errors.RelatedResourceNotFound());
              console.log('error: ',error);
          })
})




//Notificar a los interesados
router.post('/notify', jsonParser, function(req, res, next){ 

    let id = req.body.artistId;
    let email= req.body.email;
    gmailClient = new GMailAPIClient();

    checkArtist(id).then(response =>{
        //if(!response.status){

                        gmailClient.send_mail(req.body.subject, req.body.message ,
                    {"name": "" , "email" : email},
                    {"name": "", "email": ""}
                     )
          
          res.status(200)
          res.json('');
      // } 
       //else{
        //next (new errors.RelatedResourceNotFound());
       //}
   }).catch(error => console.log('Send notify error: ',error))    
})


//Eliminar todos los mails suscritos a un artista

router.delete('/subscriptions',jsonParser, function(req,res, next) {
    let id = parseInt(req.body.artistId);
    checkArtist(id)
         .then(response =>{
             if(!response.status){
                deleteAllObservers(id);
                subscriptions.set(id,[]);
                res.status(200);
                res.json(''); 
             }else{
                next (new errors.RelatedResourceNotFound())
             }
         }).catch(error =>{
            next (new errors.RelatedResourceNotFound())
         })

})

