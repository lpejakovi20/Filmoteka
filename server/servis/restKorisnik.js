const KorisnikDAO = require("./korisnikDAO.js");
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

exports.getKorisnici = function (zahtjev, odgovor) {
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

        let kdao = new KorisnikDAO();
        kdao.dajSve().then((korisnici) => {
            console.log(korisnici);
            odgovor.send(JSON.stringify(korisnici));
        });
    }
}

exports.postKorisnici = function (zahtjev, odgovor) {
    odgovor.type("application/json")

    if(zahtjev.headers["authorization"] == undefined){
        odgovor.status(401);
        let poruka = { greska: "neautorizirani pristup" }
        odgovor.send(JSON.stringify(poruka));
    }
    else{
        let objekt = zahtjev.query;

        let podaci = zahtjev.body;
        let kdao = new KorisnikDAO();
        kdao.dodaj(podaci).then((poruka) => {
            odgovor.send(JSON.stringify(poruka));
        });
    }
}

exports.deleteKorisnici = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" }
    odgovor.send(JSON.stringify(poruka));
}

exports.putKorisnici = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" }
    odgovor.send(JSON.stringify(poruka));
}

exports.getKorisnik = function (zahtjev, odgovor) {
    odgovor.type("application/json")

    if(zahtjev.headers["authorization"] == undefined){
        odgovor.status(401);
        let poruka = { greska: "neautorizirani pristup" }
        odgovor.send(JSON.stringify(poruka));
    }
    else{
        let objekt = zahtjev.query;

        let kdao = new KorisnikDAO();
        let korime = zahtjev.params.korime;
        kdao.daj(korime).then((korisnik) => {
            console.log(korisnik);
            odgovor.send(JSON.stringify(korisnik));
        });
    }
}

exports.postKorisnikPrijava = function (zahtjev, odgovor) {
    odgovor.type("application/json")

   if(zahtjev.headers["authorization"] == undefined){
        odgovor.status(401);
        let poruka = { greska: "neautorizirani pristup" }
        odgovor.send(JSON.stringify(poruka));
    }
    else{
        let kdao = new KorisnikDAO();
        let korim = zahtjev.params.korime;
        kdao.daj(korim).then((korisnik) => {
            if(korisnik!=null && korisnik.lozinka==zahtjev.body.lozinka){
                odgovor.send(JSON.stringify(korisnik));
            }
            else{ 
                odgovor.status(401)
                odgovor.send(JSON.stringify({greska: "Krivi podaci!"}))
            }
        });
    }
}

exports.getKorisnikPrijava = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" }
    odgovor.send(JSON.stringify(poruka));
}

exports.putKorisnikPrijava = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" }
    odgovor.send(JSON.stringify(poruka));
}

exports.deleteKorisnikPrijava = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" }
    odgovor.send(JSON.stringify(poruka));
}

exports.postKorisnik = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(405);
    let poruka = { greska: "metoda nije dopustena" }
    odgovor.send(JSON.stringify(poruka));
}

exports.deleteKorisnik = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" }
    odgovor.send(JSON.stringify(poruka));
}

exports.putKorisnik = function (zahtjev, odgovor) {
    odgovor.type("application/json")

    if(zahtjev.headers["authorization"] == undefined){
        odgovor.status(401);
        let poruka = { greska: "neautorizirani pristup" }
        odgovor.send(JSON.stringify(poruka));
    }
    else{
        let objekt = zahtjev.query;

        let korime = zahtjev.params.korime;
        let podaci = zahtjev.body;
        let kdao = new KorisnikDAO();
        
        kdao.azuriraj(korime, podaci).then((poruka) => {
            odgovor.send(JSON.stringify(poruka));
        });
    }
}

exports.postKorisnikAktivacija = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(405);
    let poruka = { greska: "metoda nije dopustena" }
    odgovor.send(JSON.stringify(poruka));
}

exports.putKorisnikAktivacija = function (zahtjev, odgovor) {
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
        let korim = zahtjev.params.korime;
        let podaci = zahtjev.body;
        let kdao = new KorisnikDAO();
        let koris = kdao.daj(korim);
        if(koris!=null && koris.aktivacijski_kod == zahtjev.params.aktivacijskiKod){
            kdao.aktiviraj(korim, podaci).then((poruka) => {
                odgovor.send(JSON.stringify(poruka));
            });
        }
        else{
            odgovor.status(401);
            let poruka = { greska:"Aktivacijski kod nije valjan!" }
        }
    }
}
