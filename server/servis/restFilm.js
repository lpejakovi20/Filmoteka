const FilmDAO = require("./filmDAO.js");
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

exports.getFilmovi = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    
    if(zahtjev.headers["authorization"] == undefined){
        odgovor.status(401);
        let poruka = { greska: "neautorizirani pristup" }
        odgovor.send(JSON.stringify(poruka));
    }
    else{
        let objekt = zahtjev.query;

        for(const key in objekt){
            if (key != 'odobren') {
                odgovor.status(417);
                let poruka = { greska: "neocekivani podaci" }
                odgovor.send(JSON.stringify(poruka));
            }
        }

        let fdao = new FilmDAO();
        fdao.dajSveFilmove(zahtjev.query.odobren).then((filmovi) => {
            console.log(filmovi);
            odgovor.send(JSON.stringify(filmovi));
        });
    }
}

exports.postFilmovi = function (zahtjev, odgovor) {
    odgovor.type("application/json")

    
    if(zahtjev.headers["authorization"] == undefined){
        odgovor.status(401);
        let poruka = { greska: "neautorizirani pristup" }
        odgovor.send(JSON.stringify(poruka));
    }
    else{
        let objekt = zahtjev.query;

        let podaci = zahtjev.body;
        let fdao = new FilmDAO();
        console.log(podaci);
        fdao.dodaj(podaci).then((poruka) => {
            odgovor.send(JSON.stringify(poruka));
        });
    }
}

exports.putFilmovi = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" }
    odgovor.send(JSON.stringify(poruka));
}

exports.deleteFilmovi = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" }
    odgovor.send(JSON.stringify(poruka));
}

exports.getDvaFilma = function (zahtjev, odgovor) {
    odgovor.type("application/json")

    if(zahtjev.headers["authorization"] == undefined){
        odgovor.status(401);
        let poruka = { greska: "neautorizirani pristup" }
        odgovor.send(JSON.stringify(poruka));
    }
    else{
        let objekt = zahtjev.query;

        for(const key in objekt){
            if (key != 'zanr') {
                odgovor.status(417);
                let poruka = { greska: "neocekivani podaci" }
                odgovor.send(JSON.stringify(poruka));
            }
        }

        let fdao = new FilmDAO();
        let zanr = zahtjev.query.zanr
        fdao.dajSve(zanr).then((filmovi) => {
            console.log(filmovi);
            odgovor.send(JSON.stringify(filmovi));
        });
    }
}

exports.getFilm = function (zahtjev, odgovor) {
    odgovor.type("application/json")

    if(zahtjev.headers["authorization"]==undefined){
        odgovor.status(401);
        let poruka = { greska: "neautorizirani pristup" }
        odgovor.send(JSON.stringify(poruka));
    }
    else{
        let objekt = zahtjev.query;

        let fdao = new FilmDAO();
        let id = zahtjev.params.id;
        fdao.daj(id).then((film) => {
            console.log(film);
            odgovor.send(JSON.stringify(film));
        });
    }
}

exports.postFilm = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(405);
    let poruka = { greska: "metoda nije dopustena" }
    odgovor.send(JSON.stringify(poruka));
}

exports.putFilm = function (zahtjev, odgovor) {
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
        let fdao = new FilmDAO();
        fdao.azuriraj(id, podaci).then((poruka) => {
            odgovor.send(JSON.stringify(poruka));
        });
    }
}

exports.deleteFilm = function (zahtjev, odgovor) {
    odgovor.type("application/json")

    if(zahtjev.headers["authorization"] == undefined){
        odgovor.status(401);
        let poruka = { greska: "neautorizirani pristup" }
        odgovor.send(JSON.stringify(poruka));
    }
    else{
        let objekt = zahtjev.query;

        let id = zahtjev.params.id;
        let fdao = new FilmDAO();
        fdao.obrisi(id).then((poruka) => {
            odgovor.send(JSON.stringify(poruka));
        });
    }
}