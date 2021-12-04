let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let router = express.Router()
let port = process.env.PORT || 8083;


let monitors= require('./monitors');

let monitorsClass= new monitors();
let monitorUNQfy= monitorsClass.monitorUNQfy();
let monitorNewsletter= monitorsClass.monitorNewsletter();
let monitorLogging= monitorsClass.monitorLogging();

let sendNotificationToDiscordChanell = require('./sendNotificationToDiscordChanell')

app.use(bodyParser.json())
app.use('/api',router)

let errors = require('./apiErrors') //para cargar los errores
let resourceNotFound = new errors.ResourceNotFound()

app.use(errorHandler);


app.listen(port,
    () => console.log ("Monitor running on 8083 port!"));


//Errores
app.put('*', function(req, res) { //Rutas invalidas
    const not_found = new errors.ResourceNotFound()
    res.status(404)
    res.json({status: not_found.status, errorCode: not_found.errorCode})
  });

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


//Seteamos el estado del monitor
monitorStatus = false;


//Seteamos los estados de los servicios
statusUNQfy = "OFF";
statusNewsletter = "OFF"
statusLogging= "OFF"

//Si el monitor esta encendido monitorea los estados de los servicios
function monitorear(){
    if(monitorStatus){
        monitorUNQfy;
        monitorNewsletter;
        monitorLogging;
    }
}

//Estado actual de los 3 servicios

router.route('/currentStatus').get((req,res) =>{
    res.json({statusUNQfy,
        statusNewsletter,
        statusLogging});
})

//Endpoint enviando notificaciones a discord

router.route('/statusUNQfy').post((req,res)=>{
    if(monitorStatus){
        console.log(req.body);
        sendNotificationToDiscordChanell('El servicio UNQfy ha dejado de funcionar!');
        res.json(statusUNQfy = req.body.StatusUNQfy);
    }   
})

router.route('/statusUNQfy').put((req,res) =>{
    if(monitorStatus){
        console.log(req.body)
        sendNotificationToDiscordChanell('El servicio UNQfy ha vuelto a la normalidad');
        res.json(statusUNQfy=req.body.StatusUNQfy)
    }
})

router.route('/statusNewsletter').post((req,res)=>{
    if(monitorStatus){
        console.log(req.body)
        sendNotificationToDiscordChanell('El servicio Newsletter ha dejado de funcionar')
        res.json(statusNewsletter = req.body.StatusNewsletter)
    }     
})

router.route('/statusNewsletter').put((req,res) =>{
    if(monitorStatus){
        console.log(req.body)
        sendNotificationToDiscordChanell('El servicio NewsLetter  ha vuelto a la normalidad')
        res.json(statusNewsletter=req.body.StatusNewsletter)
    }    
})

router.route('/statusLogging').post((req,res)=>{
    if(monitorStatus){
        console.log(req.body)
        sendNotificationToDiscordChanell('El servicio Logging ha dejado de funcionar')
        res.json(statusLogging = req.body.StatusLogging);
    }     
})

router.route('/statusLogging').put((req,res) =>{
    if(monitorStatus){
        console.log(req.body);
        sendNotificationToDiscordChanell('El servicio Logging ha vuelto a la normalidad');
        res.json(statusLogging=req.body.StatusLogging);
    }    
})

//Endpoint para encender el monitor, ni bien se encienda empieza a monitorear

router.get('/monitorOn', (req, res) => {
    monitorStatus = true
    monitorear();
    console.log("El monitor esta activado");
    res.status(200);
    res.json({status: 200, message: "El monitor esta activado"});
})

//Apagar el monitor

router.get('/monitorOff', (req,res) => {
    monitorStatus = false
    console.log("El monitor esta desactivado");
    res.status(200);
    res.json({status: 200, message: "El monitor esta desactivado"})
})

