const konst= require("../konstante.js");
const express = require(konst.dirModula + 'express');
const sesija = require(konst.dirModula+'express-session')
const kolacici = require(konst.dirModula+'cookie-parser')
const Konfiguracija = require("../konfiguracija");
const htmlUpravitelj = require("./htmlUpravitelj.js");
const fetchUpravitelj = require("./fetchUpravitelj.js");
const path = require('path');
const cors = require(konst.dirModula+'cors');

const server = express();

server.use(cors());

function pokreniServer() {

    const podaci = konf.dajKonf();
    const port = podaci["app.port"];

    server.use(express.urlencoded({ extended: true }));
    server.use(express.json());

    server.use(kolacici())
    server.use(sesija({
        secret: konst.tajniKljucSesija, 
        saveUninitialized: true,
        cookie: {  maxAge: 1000 * 60 * 60 * 3 },
        resave: false
    }));
    
    pripremiPutanje();

    server.use(express.static(path.join(__dirname, "angular")));

    server.all('*/',function(req,res,next){
        res.sendFile('index.html',{root : __dirname + "/angular"});
    })

    server.use((zahtjev, odgovor) => {
        odgovor.status(404);
        var poruka = { greska: "Stranica nije pronađena!" };
        //console.log(konf.dajKonf());
        odgovor.send(JSON.stringify(poruka));
    });

    server.listen(port, () => {
        console.log(`Server pokrenut na portu: ${port}`);
    });
}

let konf = new Konfiguracija();
konf.ucitajKonfiguraciju().then(() => {
    let konfa = konf.dajKonf();

    provjera = true;

    if(konfa["rest.korime"]==undefined){
        console.log("U konfiguracijskoj datoteci nedostaje: rest.korime");
        provjera = false;
    }
    if(konfa["rest.lozinka"]==undefined){
        console.log("U konfiguracijskoj datoteci nedostaje: rest.lozinka");
        provjera = false;
    }
    if(konfa["tmdb.apikey.v3"]==undefined){
        console.log("U konfiguracijskoj datoteci nedostaje: tmdb.apikey.v3");
        provjera = false;
    }
    if(konfa["rest.port"]==undefined){
        console.log("U konfiguracijskoj datoteci nedostaje: rest.port");
        provjera = false;
    }
    if(konfa["app.port"]==undefined){
        console.log("U konfiguracijskoj datoteci nedostaje: app.port");
        provjera = false;
    }

    if(konfa["tmdb.apikey.v3"].length != 32){
        console.log("U konfiguracijskoj datoteci nije ispravan tmdb.apikey.v3!");
        provjera = false;
    }


    let izrazKorime = new RegExp(/^(?=(.*\d){2})(?=(.*[a-zA-Z]){2})[0-9a-zA-Z]{15,20}$/);
    if(!izrazKorime.test(konfa["rest.korime"])) provjera = false;

    let izrazLozinka = new RegExp(/^(?=(.*[A-Za-z]){3})(?=(.*\d){3})(?=(.*[$&+,:;=?@#|'<>.^*()%!-]){3})[A-Za-z\d$&+,:;=?@#|'<>.^*()%!-]{20,100}$/)
    if(!izrazLozinka.test(konfa["rest.lozinka"])) provjera = false;

    if(!provjera) process.exit();
    pokreniServer();
    
}).catch((greska) => {
    console.log(greska);
    if (process.argv.length == 2)
        console.error("Potrebno je dati naziv datoteke");
    else
        console.error("Nije moguće otvoriti datoteku: " + greska.path);
    process.exit()
});

function pripremiPutanje() {
    server.get("/", express.static('./angular/',{index : "index.html"}));
    server.post("/prijava", htmlUpravitelj.prijava);
    server.post("/registracija", htmlUpravitelj.registracija);
    server.post("/profil",fetchUpravitelj.prikaziProfil);
    server.put("/profil",htmlUpravitelj.profil);
    server.get("/odjava", htmlUpravitelj.odjava);
    server.get("/ulogiraniKorisnik",htmlUpravitelj.ulogiraniKorisnik);
    server.get("/getJWT",fetchUpravitelj.getJWT)
}
