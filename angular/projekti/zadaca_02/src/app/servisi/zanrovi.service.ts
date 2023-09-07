import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ZanroviBaza } from './ZanroviBaza';

@Injectable({
  providedIn: 'root'
})
export class ZanroviService {
  restServis?: string = environment.restServis;
  appServis?: string = environment.appServis;
  zanroviBaza?: ZanroviBaza;
  zanrovi = new Array<ZanroviBaza>();
  brojacUnosa = 0;

  constructor() {
    let zanrovi = localStorage.getItem("zanrovi");
    console.log(zanrovi);
    if (zanrovi == null) {
      this.osvjeziZanrove();
    } else {
      this.zanrovi = JSON.parse(zanrovi) as Array<ZanroviBaza>;
    }
   }

   async dajToken(){
    let odgovor = await fetch(this.appServis + "getJWT");
    let tekst = JSON.parse(await odgovor.text());
    if(tekst.ok != null)
      return tekst.ok;
    else 
      return "0000";
  }

  async osvjeziZanrove() {
    let zaglavlje = new Headers();
    let token = await this.dajToken();
	  zaglavlje.set("Content-Type","application/json");
	  zaglavlje.append("Authorization",token);
    
    let parametri = {
      headers: zaglavlje
    };
    
    let o = (await fetch(this.restServis + "zanr",parametri)) as Response;
    if (o.status == 200) {
      let r = JSON.parse(await o.text()) as Array<ZanroviBaza>;
      console.log(r);
      this.zanrovi = r;
    }
  }

  dajZanrove() : Array<ZanroviBaza> {
    if(this.zanrovi.length == 0){
      return new Array<ZanroviBaza>;
    }
    else{
      return this.zanrovi;
    }
  }

  async dodajUbazu(p: any){
    let tijelo = {
      id : p.id,
      naziv : p.name
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
    let odgovor = (await fetch(this.restServis + "zanr", parametri)) as Response;

    if (odgovor.status == 200) {
        let podaci = await odgovor.text();
        console.log(podaci);
        this.brojacUnosa = this.brojacUnosa + 1; 
    }
  }

  async pridruziZanr(idFilm: number, idZanr: number){
    let tijelo = {
      film_id : idFilm,
      zanr_id : idZanr
    }

    let zaglavlje = new Headers();
    let token = await this.dajToken();
	  zaglavlje.set("Content-Type","application/json");
	  zaglavlje.append("Authorization",token);

    let parametri = {
        method: 'POST',
        body: JSON.stringify(tijelo),
        headers: zaglavlje
    }
    let odgovor = (await fetch(this.restServis + "pridruziZanr", parametri)) as Response;

    if (odgovor.status == 200) {
        let podaci = await odgovor.text();
        console.log(podaci) 
    }
  }

  async azurirajZanr(id: number, naziv: string){
    let zaglavlje = new Headers();
    let token = await this.dajToken();
	  zaglavlje.set("Content-Type","application/json");
	  zaglavlje.append("Authorization",token);

    let tijelo = {
        id : id,
        naziv : naziv
    }
    let parametri = {
      method: 'PUT',
      body: JSON.stringify(tijelo),
      headers: zaglavlje
    }
    let odgovor = (await fetch(this.restServis + "zanr/" + id, parametri)) as Response;
    return odgovor;
  }

  async obrisiZanrove(){
    let zaglavlje = new Headers();
    let token = await this.dajToken();
	  zaglavlje.set("Content-Type","application/json");
	  zaglavlje.append("Authorization",token);

    let parametri = {
        method: 'DELETE',
        headers: zaglavlje
    }
    let o = (await fetch(this.restServis + "zanr", parametri)) as Response;
    return o;
  }

  async dohvatiZanroveTMDB(){
    let zaglavlje = new Headers();
    let token = await this.dajToken();
	  zaglavlje.set("Content-Type","application/json");
	  zaglavlje.append("Authorization",token);

    let parametri = {
      headers: zaglavlje
    };

    let o = await fetch(this.restServis + "tmdb/zanr", parametri);
    if (o.status == 200) {
      let r = JSON.parse(await o.text());
      console.log(r);
      return r;
    }
    else return null;
  }
}
