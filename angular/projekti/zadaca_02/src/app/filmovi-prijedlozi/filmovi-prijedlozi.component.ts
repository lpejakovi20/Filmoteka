import { Component, EventEmitter, Output } from '@angular/core';
import { FilmoviService } from '../servisi/filmovi.service';
import { FilmoviBaza } from '../servisi/FilmoviBaza';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { KorisniciService } from '../servisi/korisnici.service';


@Component({
  selector: 'app-filmovi-prijedlozi',
  templateUrl: './filmovi-prijedlozi.component.html',
  styleUrls: ['./filmovi-prijedlozi.component.scss']
})
export class FilmoviPrijedloziComponent {

  filmovi = new Array<FilmoviBaza>();

  url = environment.restServis;

  posterTmdb = "https://www.themoviedb.org/t/p/w600_and_h900_bestv2";

  constructor(private filmoviServis:FilmoviService, private router:Router, private korisniciServis: KorisniciService){

  }

  trackByFn(index : number, object:any){
    return object.id;
  }

  async ngOnInit() {
    await this.korisniciServis.dajUlogiranogKorisnika();
    if(this.korisniciServis.ulogaKorisnika!=1){
      this.router.navigate(["/popis"]);
    }
    else{
      this.dohvatiFilmove();
      if(this.filmovi.length == 0)
        setTimeout(this.dohvatiFilmove.bind(this),3000);
      console.log(this.filmovi);
    }
  }

  async dohvatiFilmove(){
    this.filmovi = await this.filmoviServis.dajFilmove(0);
  }

  async obrisiFilm(id: number) {
   let o = await this.filmoviServis.obrisiFilm(id);
    if(o && o.status == 200) {
      alert("Film s id=" + id + " je uspješno obrisan!");
      this.dohvatiFilmove();
    }
    else{
      alert("Dogodila se greška prilikom brisanja!");
    }
 }

  async odobriFilm(id: number) {
    let o = await this.filmoviServis.odobriFilm(id);
    if (o.status == 200) {
      alert("Film s id=" + id + " je uspješno odobren!");
      this.dohvatiFilmove();
    }
    else{
      alert("Film s id=" + id + " nije odobren!");
    }
  }
}
