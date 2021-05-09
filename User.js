module.exports = class {

    constructor(name, dateBirth, message) {
        this.name = "";
        this.dateBirth = "";
        this.message = message;

        this.setName(name);
        this.setDateBirth(dateBirth);
    }


    getName() {
        return this.name;
    }

    setName(name){
        this.name = name;
    }

    getBirth() {
        return this.dateBirth;
    }

    setDateBirth(dBirth) {
        if (!dBirth.d && !dBirth.includes("-")) {
            throw "La fecha de nacimiento debe ser con formato: mm/dd";
        }

        if (!dBirth.d) {
            let dateArr = dBirth.split("-");
            let month = dateArr[0];
            let day = dateArr[1];
    
            if (month > 12) {
                throw "El mes no puede ser mayor a 12.";
            }
    
            if (day > 31) {
                throw "El dia no puede ser mayor a 31.";
            }
    
            this.dateBirth = {
                m: month,
                d: day
            }
        } 
        else {
            this.dateBirth = dBirth;
        }
    }

    isBirth(today) {
        return (today.getMonth() + 1) == this.dateBirth.m && today.getDate() == this.dateBirth.d
    }

    getMessage() {
        return this.message;
    }

    setMessage(message) {
        this.message = message;
    }
}