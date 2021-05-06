const fs = require('fs');
const User = require('./User.js');
const webhook = require("webhook-discord");
const Hook = new webhook.Webhook(process.env.WEBHOOK);

module.exports = class {
    

    constructor(){
        this.users = [];
        this.loadData();
    }

    loadData() {
        let users = require('./data/users.json');
        console.log('Loading '+ users.length + " users from file");
        users.forEach(usr => {
            try {
                this.users.push(new User(usr.name, usr.dateBirth, usr.message));
            } catch(error) {
                console.error("Usuario incorrecto en el archivo de datos:", usr, error);
            }


        })
        console.log('Loaded '+ this.users.length + ' users on memory');
    }

    saveData() {
        console.log('Going to save users!');
        fs.writeFile('./data/users.json', JSON.stringify(this.users, null, 2), function(err, result){
			if(err) {
			 console.log('Cannot save a file: ' + err);
			 console.log(err);
            }
        });
    }

    getUsers() {
        return this.users;
    }

    addUser(user) {
        this.users.push(user);
        this.saveData();
        console.log('New user was created, adding to list');
    }

    removeUser(user){
        this.users = this.users.filter(usr => usr.getName().toLowerCase() != user.getName().toLowerCase())
        console.log('Removed user, saving with new changes');
        this.saveData();
    }

    getUserByName(name) {
        return this.users.filter(usr => usr.getName().toLowerCase() == name.toLowerCase());
    }


    notify() {
        var today = new Date();
        let cont = 0;

        this.users.forEach(usr => {
            if (usr.isBirth(today)) {
                
                let msg = usr.getName();
                msg += "\n" + usr.getMessage();

                //Hook.info("Cumpleaños", msg);
                const cHook = new webhook.MessageBuilder()
                    .setTitle(usr.getName())
                    .setName("Cumpleaños")
                    .setColor("#aabbcc")
                    .setDescription(usr.getMessage());
                Hook.send(cHook);

                

                cont++;
            }
        })

        if (cont != 0) {
            console.log('Sended ' + cont + ' notifications');
        }

        return cont;
    }
}