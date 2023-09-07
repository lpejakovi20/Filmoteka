import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { FilmoviI } from './FilmoviI';
import { FilmoviTmdbI, FilmTmdbI } from './FilmoviTmdbI';

@Injectable({
  providedIn: 'root'
})
export class FilmoviServiceTMDB {
  restServis?: string = environment.restServis;
  appServis?: string = environment.appServis;
  filmoviTMDB?: FilmoviTmdbI;
  filmovi = new Array<FilmoviI>();

  page?: number;
  total_pages?: number;

  constructor() {
    let filmovi = localStorage.getItem("filmovi");
    console.log(filmovi);
    if (filmovi == null) {
      this.osvjeziFilmove(1, "");
    } else {
      this.filmoviTMDB = JSON.parse(filmovi) as FilmoviTmdbI;
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

  async osvjeziFilmove(stranica: number, kljucnaRijec: string) {
    let zaglavlje = new Headers();
    let token = await this.dajToken();
	  zaglavlje.set("Content-Type","application/json");
	  zaglavlje.append("Authorization",token);
    
    let parametri = {
      headers: zaglavlje
    };

    let o = (await fetch(this.restServis + "tmdb/filmovi?stranica=" + stranica + "&kljucnaRijec=" + kljucnaRijec,parametri)) as Response;
    if (o.status == 200) {
      let r = JSON.parse(await o.text()) as FilmoviTmdbI;
      console.log("osvjezavam filmove");
      console.log(r);
      this.filmoviTMDB = r;
      localStorage.setItem("filmovi",JSON.stringify(r));
    }
  }

  dajFilmove(): Array<FilmoviI> {
    if (this.filmovi.length == 0) {
      console.log("filmovi length == 0");
      if (this.filmoviTMDB == undefined) {
        console.log("filmovi tmdb == undefined");
        return new Array<FilmoviI>();
      } else if (/*this.filmoviTMDB.results.length == 0*/ this.filmoviTMDB.results == undefined) {
        console.log("filmovi tmdb results == undefined");
        return new Array<FilmoviI>();
      } else {
        this.filmovi = new Array<FilmoviI>();
        for (let filmTMDB of this.filmoviTMDB.results) {
          let film: FilmoviI = {
            naziv: filmTMDB.title,
            opis: filmTMDB.overview,
            id : filmTMDB.id,
            originalni_naziv: filmTMDB.original_title,
            originalni_jezik: filmTMDB.original_language,
            datum_premijere: filmTMDB.release_date,
            poster_putanja: filmTMDB.poster_path
          };
          this.filmovi.push(film);
        }
        this.page = this.filmoviTMDB.page;
        this.total_pages = this.filmoviTMDB.total_pages;
        return this.filmovi;
      }
    } else {
      return this.filmovi;
    }
  }

  dajFilm(id: number): FilmTmdbI | null {
    if (this.filmoviTMDB == undefined)
      return null;
    if (this.filmoviTMDB.results.length == 0)
      return null;
    for (let film of this.filmoviTMDB.results) {
      if (film.id == id) {
        return film;
      }
    }
    return null;
  }

  async dajFilmTMDB(idFilma: number){
    let zaglavlje = new Headers();
    let token = await this.dajToken();
	  zaglavlje.set("Content-Type","application/json");
	  zaglavlje.append("Authorization",token);
    
    let parametri = {
      headers: zaglavlje
    };

    let o = (await fetch(this.restServis + "tmdb/film?id=" + idFilma, parametri)) as Response;
    let dohvacen = await o.text();
    let dohvaceniFilm = JSON.parse(dohvacen);

    return dohvaceniFilm;
  }
}