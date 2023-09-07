import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KorisniciService {
  restServis?: string = environment.restServis;
  appServis?: string = environment.appServis;

  ulogaKorisnika? : number;

  constructor() {
  }

  async prijavi(korime: string, lozinka:string){
    let tijelo = {
      korime: korime,
      lozinka: lozinka
    };
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");

    let parametri = {
        method: 'POST',
        body: JSON.stringify(tijelo),
        headers: zaglavlje
    }
    let odgovor = (await fetch(this.appServis + "prijava",parametri)) as Response;
    if(odgovor.status==200){
      let podaci = await odgovor.text();
      let korisnik = JSON.parse(podaci);
      return korisnik;
    }
    else return null;
  }

  async registriraj(ime: string, prezime: string, korime: string, lozinka: string, email: string){
    let tijelo = {
      ime : ime,
      prezime : prezime,
      korime: korime,
      lozinka: lozinka,
      email : email
    };
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");

    let parametri = {
        method: 'POST',
        body: JSON.stringify(tijelo),
        headers: zaglavlje
    }
    let odgovor = (await fetch(this.appServis + "registracija",parametri)) as Response;
    if(odgovor.status==200){
      return true;
    }
    else return false;
  }

  async dajUlogiranogKorisnika(){
    let o = (await fetch(this.appServis + "ulogiraniKorisnik")) as Response;
    if(o.status==200){
      let podaci = await o.text();
      let uloga = JSON.parse(podaci);
      console.log("dohvacena uloga: ");
      console.log(uloga);
      this.ulogaKorisnika = uloga.uloga;
      console.log("uloga u korisniciServis: " + this.ulogaKorisnika);

    }
    else{
      alert("Dohvaćanje uloge nije uspjelo!");
    }
  }

  async azurirajKorisnika(ime: string, prezime: string, korime: string, lozinka: string, email: string){
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
    let tijelo = {
      ime : ime,
      prezime : prezime,
      lozinka : lozinka,
      korime : korime
    }
    let parametri = { method: 'PUT', body: JSON.stringify(tijelo), headers : zaglavlje}
    let odgovor = (await fetch(this.appServis + "profil", parametri)) as Response;
    if (odgovor.status == 200) {
        alert("Profil ažuriran!"); 
    }
  }
}
