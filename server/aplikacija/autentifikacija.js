const konst = require("../konstante.js");
const Konfiguracija = require("../konfiguracija.js");
const mail = require("./moduli/mail.js")
const kodovi = require("./moduli/kodovi.js")
//const portRest = require(konst.dirPortova + "portovi_rest.js").lpejakovi20;
//const portRest = 4300;
const totp = require("./moduli/totp.js")

const konf = new Konfiguracija;

var portRest;
var portApp

//let konf = new Konfiguracija();
//konf.ucitajKonfiguraciju();

class Autentifikacija {
    async dodajKorisnika(korisnik) {
        await this.ucitajKonf();

        let tijelo = {
            ime: korisnik.ime,
            prezime: korisnik.prezime,
            lozinka: kodovi.kreirajSHA256(korisnik.lozinka, korisnik.korime),
            email: korisnik.email,
            korime: korisnik.korime
        };
        
        let aktivacijskiKod = kodovi.dajNasumceBroj(10000, 99999);
        tijelo["aktivacijskiKod"] = aktivacijskiKod;
        let tajniTOTPkljuc = totp.kreirajTajniKljuc(korisnik.korime);
        tijelo["TOTPkljuc"] = tajniTOTPkljuc;
        

        let zaglavlje = new Headers();
        let token = await this.dajToken();
	    zaglavlje.set("Content-Type","application/json");
	    zaglavlje.append("Authorization",token);

        let parametri = {
            method: 'POST',
            body: JSON.stringify(tijelo),
            headers: zaglavlje
        }
        //let rest_podaci = konf.dajKonf(); 
        let odgovor = await fetch("http://localhost:" + portRest + "/api/korisnici", parametri)

        if (odgovor.status == 200) {
            console.log("Korisnik ubačen na servisu");
            /*
            let mailPoruka = "aktivacijski kod:" + aktivacijskiKod
                + " http://spider.foi.hr:12145/aktivacijaRacuna?korime=" + korisnik.korime + "&kod=" + aktivacijskiKod
            mailPoruka += " TOTP Kljuc: " + tajniTOTPkljuc;
            let poruka = await mail.posaljiMail("lpejakovi20@foi.hr", korisnik.email,
                "Aktivacijski kod", mailPoruka);
            */
            return true;
        } else {
            console.log(odgovor.status);
            console.log(await odgovor.text());
            return false;
        }
    }

    async ucitajKonf(){
        await konf.ucitajKonfiguraciju().then(() => {
            let konfa = konf.dajKonf();
            console.log(konfa);
        
            portRest = konfa["rest.port"];
            portApp = konfa["app.port"];
        });
    }

    async dajToken(){
        let odgovor = await fetch("http://localhost:" + portApp + "/getJWT");
        let tekst = JSON.parse(await odgovor.text());
        if(tekst.ok != null)
          return tekst.ok;
        else 
          return "0000";
      }

    async aktivirajKorisnickiRacun(korime, kod) {
        let zaglavlje = new Headers();
        zaglavlje.set("Content-Type", "application/json");
        let parametri = {
            method: 'PUT',
            body: JSON.stringify({ aktivacijskiKod: kod }),
            headers: zaglavlje
        }
        let rest_podaci = konf.dajKonf(); 
        return await fetch("http://spider.foi.hr:" + portRest + "/api/korisnici/" + korime + "/aktivacija?korime=" + rest_podaci["rest.korime"] + "&lozinka=" + rest_podaci["rest.lozinka"], parametri)
    }

    async prijaviKorisnika(korime, lozinka) {
        await this.ucitajKonf();

        lozinka = kodovi.kreirajSHA256(lozinka, korime);
        console.log("lozinka rjesena");
        let tijelo = {
            lozinka: lozinka,
        };

        let zaglavlje = new Headers();
        let token = await this.dajToken();
	    zaglavlje.set("Content-Type","application/json");
	    zaglavlje.append("Authorization",token);

        let parametri = {
            method: 'POST',
            body: JSON.stringify(tijelo),
            headers: zaglavlje
        }
        //let rest_podaci = konf.dajKonf(); 
        let odgovor = await fetch("http://localhost:" + portRest + "/api/korisnici/" + korime + "/prijava", parametri)

        if (odgovor.status == 200) {
            let x = await odgovor.text();
            return x;
        } else {
            return null;
        }
    }

}

module.exports = Autentifikacija;