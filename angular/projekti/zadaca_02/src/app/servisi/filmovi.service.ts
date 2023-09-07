import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { FilmoviBaza } from './FilmoviBaza';

//const Konfiguracija = require("../../../../../../server/konfiguracija.js");

//let konf = new Konfiguracija();
//konf.ucitajKonfiguraciju();

@Injectable({
  providedIn: 'root'
})
export class FilmoviService {
  restServis?: string = environment.restServis;
  appServis?: string = environment.appServis;
  filmoviBaza?: FilmoviBaza;
  filmovi = new Array<FilmoviBaza>();
  film? : FilmoviBaza;

  constructor() {
    
   }

  async dajToken(){
    let odgovor = await fetch(this.appServis + "getJWT");
    let tekst = JSON.parse(await odgovor.text());
    if(tekst.ok != null)
      return tekst.ok;
    else 
      return "0000";
  }

  async osvjeziFilmove(zanr: number) {
    let zaglavlje = new Headers();
    let token = await this.dajToken();
	  zaglavlje.set("Content-Type","application/json");
	  zaglavlje.append("Authorization",token);

    let parametri = {
      headers: zaglavlje
    };
    
    let o = (await fetch(this.restServis + "dajDvaFilma?zanr=" + zanr,parametri)) as Response;
    if (o.status == 200) {
      let r = JSON.parse(await o.text()) as Array<FilmoviBaza>;
      console.log(r);
      this.filmovi = r;
    }
  }

  async dajFilmove(odobren : number) {
    let zaglavlje = new Headers();
    let token = await this.dajToken();
	  zaglavlje.set("Content-Type","application/json");
	  zaglavlje.append("Authorization",token);

    let parametri = {
      headers: zaglavlje
    };
    
    let o = (await fetch(this.restServis + "filmovi?odobren=" + odobren, parametri)) as Response;
    if (o.status == 200) {
      let r = JSON.parse(await o.text()) as Array<FilmoviBaza>;
      console.log(r);
      this.filmovi = r;
      return this.filmovi;
    }
    else return new Array<FilmoviBaza>;
  }

  async dajFilm(id : string){
    let zaglavlje = new Headers();
    let token = await this.dajToken();
	  zaglavlje.set("Content-Type","application/json");
	  zaglavlje.append("Authorization",token);

    let parametri = {
      headers: zaglavlje
    };

    let o = (await fetch(this.restServis + "filmovi/" + id,parametri)) as Response;
    if (o.status == 200) {
      let x = await o.text();
      console.log("dohvaceni film: ");
      console.log(x);
      if(x.length==0){
        console.log("film nije pronadjen!");
        return null;
      }
      else {
        let r = JSON.parse(x) as FilmoviBaza;
        console.log(r);
        this.film = r;
        return this.film;
      }
    }
    else return null;
  }

  async dodajUbazu(dohvaceniFilm : any){
    let tijelo = this.sastaviTijeloPostZahtjeva(dohvaceniFilm);

    let zaglavlje = new Headers();
    let token = await this.dajToken();
	  zaglavlje.set("Content-Type","application/json");
	  zaglavlje.append("Authorization",token);
    
    let parametri = {
        method: 'POST',
        body: JSON.stringify(tijelo),
        headers: zaglavlje
    }
    let odgovor = (await fetch(this.restServis + "filmovi", parametri)) as Response;
    if (odgovor.status == 200) {
      let podaci = await odgovor.text();
      console.log(podaci);
      alert("Dodan film u bazu!");

    } else if (odgovor.status == 401) {
      alert("Neautorizirani pristup! Prijavite se!");
    } else {
      alert("Greška u dodavanju filma!");
    }
    
  }

  sastaviTijeloPostZahtjeva(dohvaceniFilm: any){
    let adult;
    if(dohvaceniFilm.adult) adult = 1;
    else adult = 0;
    
    let tijelo = {
        id: dohvaceniFilm.id,
        tagline : dohvaceniFilm.tagline,
        naziv: dohvaceniFilm.original_title,
        datum_premijere : dohvaceniFilm.release_date,
        trajanje : dohvaceniFilm.runtime,
        radnja : dohvaceniFilm.overview,
        ocjena : dohvaceniFilm.vote_average,
        budzet : dohvaceniFilm.budget,
        prihod : dohvaceniFilm.revenue,
        za_odrasle : adult,
        status : dohvaceniFilm.status,
        poster_putanja : dohvaceniFilm.poster_path,
        izvorni_jezik : dohvaceniFilm.original_language,
        id_korisnik : 53
    };

    return tijelo;
  }

  async obrisiFilm(id : number){

    let zaglavlje = new Headers();
    let token = await this.dajToken();
	  zaglavlje.set("Content-Type","application/json");
	  zaglavlje.append("Authorization",token);

    let parametri = {
        method: 'DELETE',
        body: JSON.stringify({ id : id }),
        headers: zaglavlje
    }
    
    let o = await fetch(this.restServis + "zanrFilma", parametri)
    if(o.status == 200){
      let o2 = await fetch(this.restServis + "filmovi/" + id, parametri)
      return o2;
    }
    else{
      alert("Dogodila se greška prilikom brisanja!");
      return null;
    }
  }

  async odobriFilm(id : number){
  
    let zaglavlje = new Headers();
    let token = await this.dajToken();
	  zaglavlje.set("Content-Type","application/json");
	  zaglavlje.append("Authorization",token);

    let odobren = 1;
    let parametri = {
        method: 'PUT',
        body: JSON.stringify({ odobren: odobren }),
        headers: zaglavlje
    }
    let o = (await fetch(this.restServis + "filmovi/" + id, parametri)) as Response;
    return o;
  }

}
