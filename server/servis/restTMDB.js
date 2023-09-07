const TMDBklijent = require("./klijentTMDB.js");

class RestTMDB {

    constructor(api_kljuc) {
        this.tmdbKlijent = new TMDBklijent(api_kljuc);
        console.log(api_kljuc);
        
        this.tmdbKlijent.dohvatiFilm(500).then(console.log).catch(console.log);
    }

    getZanr(zahtjev, odgovor) {
        console.log(this);
        
        if(zahtjev.headers["authorization"] == undefined){
            odgovor.status(401);
            let poruka = { greska: "neautorizirani pristup" }
            odgovor.send(JSON.stringify(poruka));
        }
        
        this.tmdbKlijent.dohvatiZanrove().then((zanrovi) => {
            //console.log(zanrovi);
            odgovor.type("application/json")
            odgovor.send(zanrovi);
        }).catch((greska) => {
            odgovor.json(greska);
        });
    }

    getFilm(zahtjev, odgovor){
        if(zahtjev.headers["authorization"] == undefined){
            odgovor.status(401);
            let poruka = { greska: "neautorizirani pristup" }
            odgovor.send(JSON.stringify(poruka));
        }

        this.tmdbKlijent.dohvatiFilm(zahtjev.query.id).then((film) => {
            //console.log(filmovi);
            odgovor.send(film);
        }).catch((greska) => {
            odgovor.json(greska);
        });
    }

    getFilmovi(zahtjev, odgovor) {
        console.log(this);
        odgovor.type("application/json")
        let stranica = zahtjev.query.stranica;
        let rijeci = zahtjev.query.kljucnaRijec;

        if(zahtjev.headers["authorization"] == undefined){
            odgovor.status(401);
            let poruka = { greska: "neautorizirani pristup" }
            odgovor.send(JSON.stringify(poruka));
        }
        else if(stranica == null || rijeci==null){
            odgovor.status("417");
            odgovor.send({greska: "neocekivani podaci"});
            return;
        }

        this.tmdbKlijent.pretraziFilmove(rijeci,stranica).then((filmovi) => {
            //console.log(filmovi);
            odgovor.send(filmovi);
        }).catch((greska) => {
            odgovor.json(greska);
        });
    }
}

module.exports = RestTMDB;