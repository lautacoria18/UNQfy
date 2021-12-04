let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let router = express.Router()
let fs = require('fs')
var winston  = require('winston');
var {Loggly} = require('winston-loggly-bulk');
let port = process.env.PORT || 8082;
let fetch = require('cross-fetch')

app.use(bodyParser.json())
app.use('/api',router)
app.use(errorHandler);

let errors = require('../apiErrors') //para cargar los errores
let resourceNotFound = new errors.ResourceNotFound()

//Encender la api
app.listen(port,
    () =>{ console.log ("Servicio Logging corriendo en 8082")
           sendNotifyLogging();
        });



//Errores

app.post('*', function(req, res) { //Rutas invalidas
    const not_found = new errors.ResourceNotFound()
    res.status(404)
    res.json({status: not_found.status, errorCode: not_found.errorCode})
  });
  
  app.get('*', function(req, res) {
    const not_found = new errors.ResourceNotFound()
    res.status(404)
    res.json({status: not_found.status, errorCode: not_found.errorCode})
  });

  function errorHandler(err, req, res, next) {

    if (err instanceof SyntaxError) { //json invalido
     const error = new errors.BadRequest()
     res.status(400)
     res.json({status: 400, errorCode: error.errorCode})
     next();
 }
 else if (err instanceof errors.ResourceNotFound){

    res.status(resourceNotFound.status)
    res.json({
        status: resourceNotFound.status,
        errorCode: resourceNotFound.errorCode
  })
  }
}

logActivo = true;

//Avisarle al monitor si el servicio volvio a la normalidad

function sendNotifyLogging(){
            return fetch('http://localhost:8083/api/statusLogging', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({StatusLogging: 'ON'})
            }).then(res => res.json())
            .catch(err => console.error(err));
        }

//Enviar logs a loggly

function enviarLog(mensaje, tipo){
    winston.add(new Loggly({
        token: "9440efd8-85a8-41ac-8f31-b36267d8aff1",
        subdomain: "www1",
        tags: ["Winston-NodeJS"],
        json: true
    }));
    winston.log(tipo, mensaje);
    }


//Guardar los registros en un archivo txt
    function guardarComandos(mensaje, tipo) {

        fs.appendFileSync('archivosLocales.txt', mensaje + ":" + tipo);
    }

//Activar el servicio de log

router.get('/logOn', (req, res) => {
    logActivo = true;
    console.log("El log esta activado! Ya puede enviar registros")
    res.status(200)
    res.json("El log esta activado! Ya puede enviar registros")
})

//Desactivar el servicio de log

router.get('/logOff', (req,res) => {
    logActivo = false;
    console.log("El log esta desactivado");
    res.status(200);
    res.json("El log esta desactivado");
})

router.post('/enviarLog', (req,res) => {
    if (logActivo) {
        let mensaje = req.body.mensaje;
        let tipo = req.body.tipo;
        enviarLog(mensaje,tipo);
        guardarComandos(mensaje,tipo);
        res.status(200);
        console.log('Enviando mensaje a loggly!');
    }
    else{
        console.log('No se puede enviar mensaje a Loggly porque esta inactivo!');
    }
})






