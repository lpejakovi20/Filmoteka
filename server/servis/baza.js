const konst = require("../konstante.js");
const mysql = require(konst.dirModula + "mysql2");
const ds = require("fs");

const sqlite3 = require("sqlite3");
//import {Database} from "sqlite3";
//const db = new Database("baza.sqlite");

class Baza {

    constructor() {
        //this.db = new Database("baza.sqlite");
        this.db = new sqlite3.Database("../baza.sqlite");
        
        /*this.ucitajPodatkeZaBazu();
        this.vezaDB = mysql.createConnection({
            host: this.podaciBaza.bazaServer,
            user: this.podaciBaza.bazaKorime,
            password: this.podaciBaza.bazaLozinka,
            database: this.podaciBaza.bazaNaziv
        });
        */
    }

    spojiSeNaBazu(){
        /*
         this.vezaDB.connect((err) => {
            if (err) {
                console.log("Greška: ", err);
                this.vezaDB.end();
            }
        });
        */
    }

    ucitajPodatkeZaBazu() {
        //let podaciTekst = ds.readFileSync(konst.podaciZaBazu, "UTF-8");
        //this.podaciBaza = JSON.parse(podaciTekst);
    }
/*
    izvrsiUpit(sql, podaciZaSQL, povratnaFunkcija) {
        this.db.query(sql, podaciZaSQL, povratnaFunkcija);
        //this.vezaDB.query(sql, podaciZaSQL, povratnaFunkcija);
    }
*/
    izvrsiUpit(sql, mod, podaci) {
       if(mod=="all"){
        return new Promise ((uspjeh,neuspjeh) => {
            this.db.all(sql , (greska,rezultat) => {
                console.log("baza.js stanje: ");
                console.log(rezultat);
                if(greska) neuspjeh(greska);
                else uspjeh(rezultat);
            });
        });
       }else if(mod=="get"){
        return new Promise ((uspjeh,neuspjeh) => {
            this.db.get(sql , (greska,rezultat) => {
                console.log("baza.js stanje: ");
                console.log(rezultat);
                if(greska) neuspjeh(greska);
                else uspjeh(rezultat);
            });
        });
       }
       else if(mod=="prep"){
        return new Promise ((uspjeh,neuspjeh) => {
            let upit = this.db.prepare(sql);
            upit.run(podaci,(greska,rezultat) => {
                console.log("baza.js stanje: ");
                console.log(rezultat);
                if(greska) neuspjeh(greska);
                else uspjeh(rezultat);
            }); 
        });
       }
       else{
        return new Promise ((uspjeh,neuspjeh) => {
            this.db.exec(sql , (greska,rezultat) => {
                console.log("baza.js stanje: ");
                console.log(rezultat);
                if(greska) neuspjeh(greska);
                else uspjeh(rezultat);
            });
        });
       }
    }

    zatvoriVezu() {
        this.db.close();
    }
}

module.exports = Baza;