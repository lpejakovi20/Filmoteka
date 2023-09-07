const ZanrDAO = require("./zanrDAO.js");
const Konfiguracija = require("../konfiguracija.js");

let konf = new Konfiguracija();
konf.ucitajKonfiguraciju();

function provjeriKorime(korime){
    const izraz = /^(?=(.*\d){2})(?=(.*[a-zA-Z]){2})[0-9a-zA-Z]{15,20}$/
    return izraz.test(korime);
}

function provjeriLozinka(lozinka){
    const izraz = /^(?=(.*[A-Za-z]){3})(?=(.*\d){3})(?=(.*[$&+,:;=?@#|'<>.^*()%!-]){3})[A-Za-z\d$&+,:;=?@#|'<>.^*()%!-]{20,100}$/
    return izraz.test(lozinka);
}

exports.getZanrovi = function (zahtjev, odgovor) {
    odgovor.type("application/json")

    console.log(zahtjev.query);

    if(zahtjev.headers["authorization"] == undefined){
        odgovor.status(401);
        let poruka = { greska: "neautorizirani pristup" }
        odgovor.send(JSON.stringify(poruka));
    }
    else{
        let objekt = zahtjev.query;

        /*
        for(const key in objekt){
            if (key != 'korime' && key != 'lozinka') {
                odgovor.status(417);
                let poruka = { greska: "neocekivani podaci" }
                odgovor.send(JSON.stringify(poruka));
            }
        }
        */

        let zdao = new ZanrDAO();
        zdao.dajSve().then((zanrovi) => {
            console.log(zanrovi);
            odgovor.send(JSON.stringify(zanrovi));
        });
    }
}

exports.postZanrovi = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    
    if(zahtjev.headers["authorization"] == undefined){
        odgovor.status(401);
        let poruka = { greska: "neautorizirani pristup" }
        odgovor.send(JSON.stringify(poruka));
    }
    else{
        let objekt = zahtjev.query;

        let podaci = zahtjev.body;
        let zdao = new ZanrDAO();
        zdao.dodaj(podaci).then((poruka) => {
        odgovor.send(JSON.stringify(poruka));
    });
    }
}

exports.putZanrovi = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" }
    odgovor.send(JSON.stringify(poruka));
}

exports.deleteZanrovi = function (zahtjev, odgovor) {
    odgovor.type("application/json")

    if(zahtjev.headers["authorization"] == undefined){
        odgovor.status(401);
        let poruka = { greska: "neautorizirani pristup" }
        odgovor.send(JSON.stringify(poruka));
    }
    else {
        let objekt = zahtjev.query;

        let zdao = new ZanrDAO();
        zdao.obrisiSve().then((poruka) => {
            odgovor.send(JSON.stringify(poruka));
        });
    }
}

exports.getZanr = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    
    let korime = zahtjev.query.korime;
    let lozinka = zahtjev.query.lozinka;

    if(korime==undefined || lozinka==undefined || provjeriKorime(korime)==false || provjeriLozinka(lozinka)==false){
        odgovor.status(400);
        let poruka = { greska: "nevaljani zahtjev" }
        odgovor.send(JSON.stringify(poruka));
    }
    else if(konf.dajKonf()["rest.korime"] != korime || konf.dajKonf()["rest.lozinka"] != lozinka){
        odgovor.status(401);
        let poruka = { greska: "neautorizirani pristup" }
        odgovor.send(JSON.stringify(poruka));
    }
    else{
        let objekt = zahtjev.query;

        for(const key in objekt){
            if (key != 'korime' && key != 'lozinka') {
                odgovor.status(417);
                let poruka = { greska: "neocekivani podaci" }
                odgovor.send(JSON.stringify(poruka));
            }
        }

        let zdao = new ZanrDAO();
        let id = zahtjev.params.id;
        kdao.daj(id).then((zanr) => {
            console.log(zanr);
            odgovor.send(JSON.stringify(zanr));
        });
    }
}

exports.postZanr = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(405);
    let poruka = { greska: "metoda nije dopustena" }
    odgovor.send(JSON.stringify(poruka));
}

exports.putZanr = function (zahtjev, odgovor) {
    odgovor.type("application/json")

    if(zahtjev.headers["authorization"] == undefined){
        odgovor.status(401);
        let poruka = { greska: "neautorizirani pristup" }
        odgovor.send(JSON.stringify(poruka));
    }
    else{
        let objekt = zahtjev.query;

        let id = zahtjev.params.id;
        let podaci = zahtjev.body;
        let zdao = new ZanrDAO();
        zdao.azuriraj(id, podaci).then((poruka) => {
            odgovor.send(JSON.stringify(poruka));
        });
    }
}

exports.deleteZanr = function (zahtjev, odgovor) {
    odgovor.type("application/json")

    let korime = zahtjev.query.korime;
    let lozinka = zahtjev.query.lozinka;

    if(korime==undefined || lozinka==undefined || provjeriKorime(korime)==false || provjeriLozinka(lozinka)==false){
        odgovor.status(400);
        let poruka = { greska: "nevaljani zahtjev" }
        odgovor.send(JSON.stringify(poruka));
    }
    else if(konf.dajKonf()["rest.korime"] != korime || konf.dajKonf()["rest.lozinka"] != lozinka){
        odgovor.status(401);
        let poruka = { greska: "neautorizirani pristup" }
        odgovor.send(JSON.stringify(poruka));
    }
    else{
        let objekt = zahtjev.query;

        for(const key in objekt){
            if (key != 'korime' && key != 'lozinka') {
                odgovor.status(417);
                let poruka = { greska: "neocekivani podaci" }
                odgovor.send(JSON.stringify(poruka));
            }
        }

        let id = zahtjev.params.id;
        let zdao = new ZanrDAO();
        zdao.obrisi(id).then((poruka) => {
            odgovor.send(JSON.stringify(poruka));
        });
    }
}

exports.pridruziZanr = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    
    let korime = zahtjev.query.korime;
    let lozinka = zahtjev.query.lozinka;

    if(zahtjev.headers["authorization"] == undefined){
        odgovor.status(401);
        let poruka = { greska: "neautorizirani pristup" }
        odgovor.send(JSON.stringify(poruka));
    }
    else{
        let objekt = zahtjev.query;

        let podaci = zahtjev.body;
        let zdao = new ZanrDAO();
        zdao.pridruziZanr(podaci).then((poruka) => {
        odgovor.send(JSON.stringify(poruka));
    });
    }
}

exports.deleteZanrFilma = function (zahtjev, odgovor) {
    odgovor.type("application/json")

    if(zahtjev.headers["authorization"] == undefined){
        odgovor.status(401);
        let poruka = { greska: "neautorizirani pristup" }
        odgovor.send(JSON.stringify(poruka));
    }
    else {
        let objekt = zahtjev.query;

        let zdao = new ZanrDAO();
        zdao.obrisiZanrFilma(zahtjev.body.id).then((poruka) => {
            odgovor.send(JSON.stringify(poruka));
        });
    }
}