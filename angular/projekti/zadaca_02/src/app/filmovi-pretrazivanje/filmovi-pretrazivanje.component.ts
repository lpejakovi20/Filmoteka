import { Component, EventEmitter, OnInit, Output, OnDestroy, ApplicationRef } from '@angular/core';
import { FilmoviServiceTMDB } from '../servisi/filmoviTmdb.service';
import { FilmoviService } from '../servisi/filmovi.service';
import { FilmoviI } from '../servisi/FilmoviI';
import { environment } from '../../environments/environment';
import { ZanroviService } from '../servisi/zanrovi.service';
import { ZanroviBaza } from '../servisi/ZanroviBaza';
import { KorisniciService } from '../servisi/korisnici.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filmovi-pretrazivanje',
  templateUrl: './filmovi-pretrazivanje.component.html',
  styleUrls: ['./filmovi-pretrazivanje.component.scss']
})
export class FilmoviPretrazivanjeComponent {

  url = environment.restServis;

  filmovi = new Array<FilmoviI>();
  prikazi: string = "";
  filter: string = "";
  slika? : string;
  posteri_putanja = environment.posteriPutanja;
  zanrovi = new Array<ZanroviBaza>;
  kolekcija : any;

  page? : number;
  total_pages? : number;

  @Output() prikaziDetalje = new EventEmitter<string>();

  constructor(private filmoviServisTMDB:FilmoviServiceTMDB, private filmoviServis: FilmoviService, private router: Router, 
    private zanroviServis : ZanroviService, private appRef : ApplicationRef, private korisniciServis: KorisniciService){

  }

  trackByFn(index : number, object:any){
    return object.id;
  }

  async ngOnInit() {
    await this.korisniciServis.dajUlogiranogKorisnika();
    if(this.korisniciServis.ulogaKorisnika!=1 && this.korisniciServis.ulogaKorisnika!=2){
      this.router.navigate(["/popis"]);
    }
    else{
      this.dohvatiFilmove();
      this.dohvatiZanrove();
      if(this.filmovi.length == 0)
        setTimeout(this.dohvatiFilmove.bind(this),3000);
        setTimeout(this.dohvatiZanrove.bind(this),3000);
      console.log(this.filmovi);
    }
  }

  dohvatiFilmove(){
    this.filmoviServisTMDB.filmovi = [];
    this.filmovi = this.filmoviServisTMDB.dajFilmove();
    if(this.filmovi.length != 0){
      this.dohvatiPodatkeZaStranicenje();
    }
    console.log("ovo su stari/novi filmovi: ");
    console.log(this.filmovi);
  }

  dohvatiPodatkeZaStranicenje(){
    this.page = this.filmoviServisTMDB.page;
    this.total_pages = this.filmoviServisTMDB.total_pages;
  }

  async dohvatiFilmoveStranicenje(str : number){
    console.log("str: " + str);
    this.filmovi = [];
    await this.filmoviServisTMDB.osvjeziFilmove(str,this.dajFilter());
    this.dohvatiFilmove();
  }

  dohvatiZanrove(){
    this.zanrovi = this.zanroviServis.dajZanrove();
  }

  async dodajUbazu(idFilma: any) {
    
    for (let film of this.filmovi) {
      if (idFilma == film.id) {
        console.log("Pronadjeni film u bazi: ");
        let f = await this.filmoviServis.dajFilm(idFilma);
        console.log(f);
        if(f == null){

          let dohvaceniFilm = await this.filmoviServisTMDB.dajFilmTMDB(idFilma);

          let dohvaceniZanrovi = this.zanrovi;
          this.filmoviServis.dodajUbazu(dohvaceniFilm);
  
          let zanroviFilma = dohvaceniFilm.genres;
  
          let postoji;
          if(zanroviFilma){
            for(let p of zanroviFilma){
              postoji = false;
              let odabrani = 0;
              for(let z of dohvaceniZanrovi){
                  if(z["id"] == p["id"]){
                      postoji = true;
                      odabrani = z["id"];
                  }
              }
              if(!postoji){
                await this.zanroviServis.dodajUbazu(p);
              }
              await this.zanroviServis.pridruziZanr(dohvaceniFilm.id,p.id);
          }
          break;
          }
        }
        else{
          alert("Odabrani film je već predložen od strane drugog korisnika!");
          break;
        }
      }
    }
  }

  prikaziStranicenje(str : string,ukupno : number){
    let prikaz = <HTMLDivElement>document.getElementById("stranicenje");
    let html="";
    let stranica=parseInt(str);
    if(stranica>1){
      html="<button onclick=\"dohvatiFilmoveStranicenje(1)\"'><<<</button>";
      html+="<button onclick=\"dohvatiFilmoveStranicenje(" + (stranica-1) + ")\"><</button>";
    }
    html+="<button onclick=\"dohvatiFilmoveStranicenje(" + (stranica) + ")\">" + str + "/" + ukupno + "</button>";
    if(stranica<ukupno){
      html+="<button onclick=\"dohvatiFilmoveStranicenje(" + (stranica+1) + ")\">></button>";
      html+="<button onclick=\"dohvatiFilmoveStranicenje(" + (ukupno) + ")\">>>></button>";
    }
    prikaz.innerHTML=html;
  }

   dajFilter() {
    let filter = <HTMLInputElement>document.getElementById("filter");
    return filter.value;
}
}
