const ds = require("fs/promises");
const jwt = require("./moduli/jwt.js")
const totp = require("./moduli/totp.js")
const Autentifikacija = require("./autentifikacija.js")
const FilmoviPretrazivanje = require("./filmoviPretrazivanje.js")
const restKorisnik = require("../servis/restKorisnik.js");
const path = require("path/posix");
let auth = new Autentifikacija();
let fp = new FilmoviPretrazivanje();

exports.profil = async function (zahtjev, odgovor) {
    let greska = "";
    if(zahtjev.method == "PUT"){
        console.log("body: ");
        console.log(zahtjev.body);
        let uspjeh = await fp.azurirajKorisnika(zahtjev.body);
        if(uspjeh) odgovor.send(uspjeh);
        else {
            greska = "Azuriranje korisnika nije uspjelo!";
            odgovor.status(500);
            odgovor.send(greska);
        }
    }
}

exports.registracija = async function (zahtjev, odgovor) {
    console.log(zahtjev.body)
    let greska = "";
    if (zahtjev.method == "POST") {
        let uspjeh = await auth.dodajKorisnika(zahtjev.body);
        
        if (uspjeh) {
            odgovor.send(uspjeh);
        } else {
            greska = "Dodavanje nije uspjelo provjerite podatke!";
            odgovor.status(401);
            odgovor.send(JSON.stringify(greska));
        }
    }
}

exports.odjava = async function (zahtjev, odgovor) {

    console.log("session prije brisanja:");
    console.log(zahtjev.session);

    zahtjev.session.korisnik = null;
    zahtjev.session.korime = null;
    zahtjev.session.korisnik_id = null;
    zahtjev.session.korisnik_uloga = null;

    console.log("session nakon brisanja:");
    console.log(zahtjev.session);

    let poruka = "Odjava uspješna!";
    odgovor.send(JSON.stringify(poruka));
};

exports.ulogiraniKorisnik = async function (zahtjev, odgovor) {
    if( !("korime" in zahtjev.session) || zahtjev.session.korime == null){
        let tijelo = {
            uloga : null
        }
        odgovor.send(JSON.stringify(tijelo));    
    }

    else{
        let tijelo = {
            uloga : zahtjev.session.korisnik_uloga
        }
        odgovor.send(JSON.stringify(tijelo));
    }
}

exports.prijava = async function (zahtjev, odgovor) {
    let greska = ""
    if (zahtjev.method == "POST") {
        var korime = zahtjev.body.korime;
        var lozinka = zahtjev.body.lozinka;
        var korisnik = await auth.prijaviKorisnika(korime, lozinka);

        console.log("provjera: ");
        console.log(korisnik);
        if (korisnik) {

            let koris = JSON.parse(korisnik);
                    
            zahtjev.session.jwt = jwt.kreirajToken(korisnik)
            zahtjev.session.korisnik = koris.ime + " " + koris.prezime;
            zahtjev.session.korime = koris.korime;
            zahtjev.session.korisnik_id = koris.id;
            zahtjev.session.korisnik_uloga = koris.tip_korisnika_id;
            
            console.log("sesija:");
            console.log(zahtjev.session);

            odgovor.send(koris);

        } else {
            greska = "Netocni podaci!";
            odgovor.status(401);
            odgovor.send(JSON.stringify(greska));
        }
    }
}
