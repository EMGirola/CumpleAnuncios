const express = require("express");

var app = express();

const User = require('./User.js');
const Container = require("./UserContainer");
const WordleContainer = require("./WordleContainer");
const TimerHandler = require("./TimerHandler.js");

var container = new Container();
var wordleContainer = new WordleContainer();
var timer = new TimerHandler();

app.use(express.json());


app.get('/api/notify', async (req, res) => {
    console.log('Received request for notify');

    if (await timer.isNotificationNeeded()) {

        try {
            await container.notify();
            await wordleContainer.notify();
            await timer.insertNotification();    
        } catch(ex) {
            console.log('Exception trying to do something: ', ex);
        }

    }

    res.send('Notifiy OK');
});

app.get('/', async (req, res) => {
    let data = await container.getUsers();
    res.send(data);
}) 

app.post('/api/user/add', async (req, res) => { 

    if (!req.body 
            || !req.body.dateBirth 
            || !req.body.name
            ) {
        res.status(400).send("El usuario enviado no es correcto");
        console.log('Received request was rejected for bad request: ', req.body);
        return;
    }

    let users = await container.getUserByName(req.body.name);

    if (users.length != 0) {
        res.status(400).send("Ya existe un usuario con este nombre, por favor ingrese otro");
        console.log('Received request was rejected for duplicated name:', req.body);
        return;
    }

    let msg = (req.body.message) ? req.body.message : "Hoy es el cumpleaños de " + req.body.name + "!";
    let newUser;
    
    try {
       newUser = new User(req.body.name, req.body.dateBirth, msg)
    } catch(error) {
        console.log('Something bad happen updating the dateBirth ', error);
        return res.status(400).send(error);
    }

    container.addUser(newUser);

    res.status(201).send('Usuario creado correctamente con nombre: '+ newUser.getName());
});

app.delete('/api/user/remove', async (req, res) => { 
    if (!req.body 
            || !req.body.name
            ) {
        res.status(400).send("El usuario enviado no es correcto");
        console.log('Received request was rejected for bad request: ', req.body);
        return;
    }

    let users = await container.getUserByName(req.body.name);

    if (users.length == 0 || users.length > 1) {
        res.status(404).send("No se pudo encontrar un usuario con ese nombre");
        console.log('Received request was rejected for not found the name: ', req.body, users);
        return;
    }


    await container.removeUser(users[0]);
    res.send('Usuario borrado correctamente  con nombre: '+ users[0].getName());
});


app.put('/api/user/modify/:name', function (req, res) {
    let nameToSearch = req.params.name;

    if(!nameToSearch) {
        res.status(400).send("URI ingresada no tiene un nombre valido.");
        console.log('Recieved new request on /api/user/modify with param: ', nameToSearch);
        return;
    }

    let users = container.getUserByName(nameToSearch);

    if (users.length == 0 || users.length > 1) {
        res.status(404).send("No se pudo encontrar un usuario con ese nombre");
        console.log('Received request was rejected for not found the name: ', req.body, users);
        return;
    }
    console.log(`Received new request on /api/user/modify/${req.params.name} with body: ${req.body}`);
    let user = users[0];
    let hasChange = false;

    if(req.body.name) {
        console.log(`Setting user name from ${user.getName()} to ${req.body.name}`);
        user.setName(req.body.name);
        hasChange = true;
    }

    if (req.body.dateBirth){
        console.log(`Setting dateBirth from ${user.getBirth()} to ${req.body.dateBirth}`);
        try { 
            user.setDateBirth(req.body.name);
            hasChange = true;
        } catch (error) {
            console.log('Something bad happen updating the dateBirth ', error);
            let msg = (hasChange) ? `The name was updated to ${req.body.name} but ` : '';
            return res.status(400).send(msg + error);
        }
    }

    if(req.body.message) {
        console.log(`Setting message from ${user.getMessage()} to ${req.body.message}`);
        user.setMessage(req.body.message);
        hasChange = true;
    }

    let status;
    let msg;

    if (hasChange) {
        console.log('Sending to save the user to the new data');
        container.saveData();
        status = 200;
        msg = 'Updated user sucessfuly';
    } 
    else {
        status = 400;
        msg = 'The request doesnt have valid changes';
    }

    return res.status(status).send(msg);
})


app.listen(process.env.PORT || 3000, () => {
    console.log("El servidor esta inicializado.");
});