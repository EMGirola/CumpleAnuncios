const express = require("express");

var app = express();

const User = require('./User.js');
const Container = require("./UserContainer");
var container = new Container();

app.use(express.json());


app.get('/api/notify', function (req, res) {
    console.log('Received request for notify');
    let cant = container.notify();
    res.send('Notificados correctamente '+ cant + ' usuarios');
});

app.get('/', (req, res) => {
    res.send(container.getUsers());
}) 

app.post('/api/user/add', function (req, res) { 
    if (!req.body 
            || !req.body.dateBirth 
            || !req.body.name
            ) {
        res.status(400).send("El usuario enviado no es correcto");
        console.log('Received request was rejected for bad request');
        return;
    }

    let users = container.getUserByName(req.body.name);

    if (users.length != 0) {
        res.status(400).send("Ya existe un usuario con este nombre, por favor ingrese otro");
        console.log('Received request was rejected for duplicated name');
        return;
    }

    let msg = (req.body.message) ? req.body.message : "Hoy es el cumpleaños de " + req.body.name + "!";
    let newUser = new User(req.body.name, req.body.dateBirth, msg)

    container.addUser(newUser);

    res.status(201).send('Usuario creado correctamente con nombre: '+ newUser.getName());
});

app.delete('/api/user/remove', function (req, res) { 
    if (!req.body 
            || !req.body.name
            ) {
        res.status(400).send("El usuario enviado no es correcto");
        console.log('Received request was rejected for bad request');
        return;
    }

    let users = container.getUserByName(req.body.name);

    if (users.length == 0 || users.length > 1) {
        res.status(404).send("No se pudo encontrar un usuario con ese nombre");
        console.log('Received request was rejected for not found the name');
        return;
    }


    container.removeUser(users[0]);
    res.send('Usuario borrado correctamente  con nombre: '+ users[0].getName());
});


app.listen(process.env.PORT || 3000, () => {
    console.log("El servidor esta inicializado.");
});