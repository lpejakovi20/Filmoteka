import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';
//import { DetaljiFilmaComponent } from './detalji-filma/detalji-filma.component';
//import { FilmoviService } from './servisi/filmovi.service';
//import { FilmTmdbI } from './servisi/FilmoviTmdbI';
import { KorisniciService } from './servisi/korisnici.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'vjezba_08';
  putanja='popis';

  urlApp = environment.appServis;

  uloga? : any;

  constructor(private router : Router, private korisniciServis: KorisniciService){
  }

  ngOnInit() : void {
    this.dajUlogiranogKorisnika();
  }

  ngAfterViewInit() : void{
    this.dajUlogiranogKorisnika();
  }

  prebaciNa(putanja: string, nazivFilma: string) {
    this.putanja = putanja;
    if(putanja=='detalji'){
      //this.film=this.filmoviServis.dajFilm(nazivFilma); 
    }
  }

  async odjaviSe(){
    let o = (await fetch(this.urlApp + "odjava")) as Response;
    if(o.status==200){
      alert("Uspješna odjava!");
      this.dajUlogiranogKorisnika();
      
    }
    else{
      alert("Neuspješna odjava!");
    }
  }

  async dajUlogiranogKorisnika(){
    let o = (await fetch(this.urlApp + "ulogiraniKorisnik")) as Response;
    if(o.status==200){
      let podaci = await o.text();
      this.uloga = JSON.parse(podaci);
      console.log("dohvacena uloga: ");
      console.log(this.uloga);
      this.korisniciServis.ulogaKorisnika = this.uloga.uloga;
      console.log("uloga u korisniciServis: " + this.korisniciServis.ulogaKorisnika);

    }
    else{
      alert("Dohvaćanje uloge nije uspjelo!");
    }
  }
}
