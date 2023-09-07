import { Component,OnInit } from '@angular/core';
import { ZanroviService } from '../servisi/zanrovi.service';
import { ZanroviBaza } from '../servisi/ZanroviBaza';
import { FilmoviService } from '../servisi/filmovi.service';
import { FilmoviBaza } from '../servisi/FilmoviBaza';

@Component({
  selector: 'app-popis-zanrova-s-filmovima',
  templateUrl: './popis-zanrova-s-filmovima.component.html',
  styleUrls: ['./popis-zanrova-s-filmovima.component.scss']
})
export class PopisZanrovaSFilmovimaComponent implements OnInit {

  zanrovi = new Array<ZanroviBaza>();
  filmovi = new Array<FilmoviBaza>();
  prikazi: string = "";

  kolekcija = new Array<any>;
  
  constructor(private zanroviServis:ZanroviService, private filmoviServis:FilmoviService){

  }

  ngOnInit(): void {
    this.dohvatiZanrove();
    if(this.zanrovi.length == 0){
      setTimeout(this.dohvatiZanrove.bind(this),3000);
    }
  }

  dohvatiZanrove(){
    this.zanrovi = this.zanroviServis.dajZanrove();
    if(this.zanrovi.length != 0){
      this.kolekcija = [];
      this.zanrovi.forEach(zanr => {
        this.Pomocna(zanr.id);
      });
    }
  }

  async dohvatiFilmove(id : number){
    await this.filmoviServis.osvjeziFilmove(id);
    let dohvaceniFilmovi = this.filmoviServis.filmovi; 
    let odobreniFilmovi = new Array<FilmoviBaza>
    for(let d of dohvaceniFilmovi){
      if(d.odobren==true){
        odobreniFilmovi.push(d);
      }
    }
    return odobreniFilmovi;
  }

  provjeri(id : number, objekt : Array<any>){
    if(objekt.filter(e => e[0] === id).length > 0) return true;
    else return false;
  }

  filmoviZanra = new Array<FilmoviBaza>();

  async Pomocna(id : number){
    this.filmoviZanra = await this.dohvatiFilmove(id);
    let svi = this.filmoviZanra;
    let rez = new Array<FilmoviBaza>;

    if(svi.length > 2){
      let ind1 = this.dajNasumceBroj(0,svi.length);
      let ind2;
      do{
          ind2 = this.dajNasumceBroj(0,svi.length);
      }while(ind2==ind1);
      rez = [svi[ind1],svi[ind2]];
      this.kolekcija.push([id,rez]);
    }
    else{
      this.kolekcija.push([id,this.filmoviZanra]);
    }
    this.kolekcija.sort((a,b) => a[0] - b[0]);
  }

  dajNasumceBroj = function(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
  }
}
