const Monitor = require('ping-monitor');
const fetch = require('cross-fetch');

class monitors {


    monitorUNQfy() {

        //Instanciamos el monitor de la api de unqfy, cada 30 segundos notificara al canal de discord
        const unqfy = new Monitor({
            website: 'http://localhost:8080',
            title: 'UNQfy',
            interval: 0.5
        });

        //Cuando el servicio esta funcionando enviamos el mensaje a discord avisando que volvio a la normalidad
        unqfy.on('down', function (res) {

            return fetch('http://localhost:8083/api/statusUNQfy', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ StatusUNQfy: 'ON' })
            }).then(res => res.json())
                .catch(err => console.error(err))
        });
        //Cuando el servicio no esta funcionando enviamos el mensaje a discord avisando que dejo de funcionar
        unqfy.on('error', function (error) {
            return fetch('http://localhost:8083/api/statusUNQfy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ StatusUNQfy: 'OFF' })
            }).then(res => res.json())
                .catch(err => console.error(err))

        });
    }

    monitorNewsletter() {


        //Instanciamos el monitor de la api de newsletter, cada 30 segundos notificara al canal de discord

        const unqfy = new Monitor({
            website: 'http://localhost:8081',
            title: 'UNQfy',
            interval: 0.5
        });

        //Cuando el servicio esta funcionando enviamos el mensaje a discord avisando que volvio a la normalidad
        unqfy.on('down', function (res) {

            return fetch('http://localhost:8083/api/statusNewsletter', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ StatusNewsletter: 'ON' })
            }).then(res => res.json())
                .catch(err => console.error(err))
        });

        //Cuando el servicio no esta funcionando enviamos el mensaje a discord avisando que dejo de funcionar

        unqfy.on('error', function (error) {
            return fetch('http://localhost:8083/api/statusNewsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ StatusNewsletter: 'OFF' })
            }).then(res => res.json())
                .catch(err => console.error(err))

        });
    }

    monitorLogging() {


        //Instanciamos el monitor de la api de unqfy, cada 30 segundos notificara al canal de discord

        const unqfy = new Monitor({
            website: 'http://localhost:8082',
            title: 'UNQfy',
            interval: 0.5
        });
        //Cuando el servicio esta funcionando enviamos el mensaje a discord avisando que volvio a la normalidad       

        unqfy.on('down', function (res) {
            return fetch('http://localhost:8083/api/statusLogging', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ StatusLogging: 'ON' })
            }).then(res => res.json())
                .catch(err => console.error(err))
        });

        //Cuando el servicio no esta funcionando enviamos el mensaje a discord avisando que dejo de funcionar

        unqfy.on('error', function (error) {
            return fetch('http://localhost:8083/api/statusLogging', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ StatusLogging: 'OFF' })
            }).then(res => res.json())
                .catch(err => console.error(err))

        });
    }




}


module.exports = monitors;