const konst = require("../konstante.js");
const express = require(konst.dirModula + 'express');
const Konfiguracija = require("../konfiguracija");
const restKorisnici = require("./restKorisnik.js")
const RestTMDB = require("./restTMDB");
const restZanrovi = require("./restZanr");
const restFilmovi = require("./restFilm");

const cors = require(konst.dirModula+'cors')

const server = express();

server.use(cors());

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
    if (process.argv.length == 2)
        console.error("Potrebno je unjeti naziv datoteke!");
    else
        console.error("Naziv datoteke nije dobar: " + greska.path);
    process.exit()
});

function pokreniServer() {
    server.use(express.urlencoded({ extended: true }));
    server.use(express.json());

    const podaci = konf.dajKonf();
    const port = podaci["rest.port"];

    pripremiPutanjeKorisnik();
    pripremiPutanjeTMDB();

    pripremiPutanjeZanr();
    pripremiPutanjeFilm();

    server.use((zahtjev, odgovor) => {
        odgovor.status(404);
        let poruka = { greska: "nema resursa!" }
        odgovor.json(poruka);
    });

    server.listen(port, () => {
        console.log(`Server pokrenut na portu: ${port}`);
    });
}

function pripremiPutanjeKorisnik(){
    server.get("/api/korisnici",restKorisnici.getKorisnici);
    server.post("/api/korisnici",restKorisnici.postKorisnici);
    server.put("/api/korisnici",restKorisnici.putKorisnici);
    server.delete("/api/korisnici",restKorisnici.deleteKorisnici);

    server.get("/api/korisnici/:korime",restKorisnici.getKorisnik);
    server.post("/api/korisnici/:korime",restKorisnici.postKorisnik);
    server.put("/api/korisnici/:korime",restKorisnici.putKorisnik);
    server.delete("/api/korisnici/:korime",restKorisnici.deleteKorisnik);

    server.post("/api/korisnici/:korime/prijava",restKorisnici.postKorisnikPrijava);
    server.get("/api/korisnici/:korime/prijava",restKorisnici.getKorisnikPrijava);
    server.put("/api/korisnici/:korime/prijava",restKorisnici.putKorisnikPrijava);
    server.delete("/api/korisnici/:korime/prijava",restKorisnici.deleteKorisnikPrijava);

    server.post("/api/korisnici/:korime/aktivacija",restKorisnici.postKorisnikAktivacija);
    server.put("/api/korisnici/:korime/aktivacija",restKorisnici.putKorisnikAktivacija);
}

function pripremiPutanjeZanr(){
    server.get("/api/dajSveZanrove", restZanrovi.getZanrovi);

    server.get("/api/zanr", restZanrovi.getZanrovi);
    server.post("/api/zanr", restZanrovi.postZanrovi);
    server.put("/api/zanr", restZanrovi.putZanrovi);
    server.delete("/api/zanr", restZanrovi.deleteZanrovi);

    server.delete("/api/zanrFilma", restZanrovi.deleteZanrFilma);

    server.post("/api/pridruziZanr", restZanrovi.pridruziZanr);

    server.get("/api/zanr:id", restZanrovi.getZanr);
    server.post("/api/zanr:id", restZanrovi.postZanr);
    server.put("/api/zanr/:id", restZanrovi.putZanr);
    server.delete("/api/zanr:id", restZanrovi.deleteZanr);
}

function pripremiPutanjeFilm(){
    server.get("/api/dajDvaFilma", restFilmovi.getDvaFilma);

    server.get("/api/filmovi",restFilmovi.getFilmovi);
    server.post("/api/filmovi",restFilmovi.postFilmovi);
    server.put("/api/filmovi",restFilmovi.putFilmovi);
    server.delete("/api/filmovi",restFilmovi.deleteFilmovi);

    server.get("/api/filmovi/:id", restFilmovi.getFilm);
    server.post("/api/filmovi/:id", restFilmovi.postFilm);
    server.put("/api/filmovi/:id", restFilmovi.putFilm);
    server.delete("/api/filmovi/:id", restFilmovi.deleteFilm);
}

function pripremiPutanjeTMDB() {
    let restTMDB = new RestTMDB(konf.dajKonf()["tmdb.apikey.v3"]);
    server.get("/api/tmdb/zanr",restTMDB.getZanr.bind(restTMDB));
    server.get("/api/tmdb/filmovi",restTMDB.getFilmovi.bind(restTMDB));
    server.get("/api/tmdb/film",restTMDB.getFilm.bind(restTMDB));
}

    