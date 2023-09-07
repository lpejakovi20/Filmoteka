const konst = require("../konstante.js");
const Konfiguracija = require("../konfiguracija.js");
//const portRest = require(konst.dirPortova + "portovi_rest.js").lpejakovi20;
const konf = new Konfiguracija;

var portRest;
var portApp

//const portRest = konfa["rest.port"];
//const portApp = konfa["app.port"];
//const url = "http://spider.foi.hr:" + portRest + "/api";
//const url = "http://localhost:" + portRest + "/api";

const kodovi = require("./moduli/kodovi.js")

class FilmoviZanroviPretrazivanje {

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

    async dohvatiKorisnika(korime){
        //let rest_podaci = konf.dajKonf();
        await this.ucitajKonf();

        let zaglavlje = new Headers();
        let token = await this.dajToken();
	    zaglavlje.set("Content-Type","application/json");
	    zaglavlje.append("Authorization",token);

        let parametri = {
            headers : zaglavlje
        }

        let odgovor = await fetch("http://localhost:" + portRest + "/api/korisnici/" + korime, parametri);
        let podaci = await odgovor.text();
        let korisnik = JSON.parse(podaci);

        //console.log(korisnik);
        return korisnik;
    }

    async azurirajKorisnika(korisnik){
        let zaglavlje = new Headers();
        let token = await this.dajToken();
	    zaglavlje.set("Content-Type","application/json");
	    zaglavlje.append("Authorization",token);

        korisnik["lozinka"] = kodovi.kreirajSHA256(korisnik.lozinka, korisnik.korime);
        let parametri = {
            method: 'PUT',
            body: JSON.stringify(korisnik),
            headers: zaglavlje
        }
        return await fetch("http://localhost:" + portRest + "/api/korisnici/" + korisnik.korime, parametri)
    }
}



module.exports = FilmoviZanroviPretrazivanje;