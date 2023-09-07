import { Location } from '@angular/common';
import { Component, DoCheck, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { FilmoviService } from '../servisi/filmovi.service';
import { FilmoviBaza } from '../servisi/FilmoviBaza';
import { KorisniciService } from '../servisi/korisnici.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalji-filma',
  templateUrl: './detalji-filma.component.html',
  styleUrls: ['./detalji-filma.component.scss']
})
export class DetaljiFilmaComponent implements DoCheck, OnChanges, OnInit {
  
  @Input() film:FilmoviBaza|null = null;
  naziv?:string;
  opis?:string;
  slika?:string;

  constructor(private filmoviServis:FilmoviService,
              private activatedroute:ActivatedRoute,
              private lokacija:Location,private korisniciServis: KorisniciService, private router: Router){
    
  }

  async ngOnInit(){
    await this.korisniciServis.dajUlogiranogKorisnika();
    if(this.korisniciServis.ulogaKorisnika!=1 && this.korisniciServis.ulogaKorisnika!=2){
      this.router.navigate(["/popis"]);
    }
    this.activatedroute.paramMap.subscribe(async parametri => {
      let idFilma = parametri.get("id");
      if(idFilma!=null){
        this.film = await this.filmoviServis.dajFilm(idFilma);
        this.prikazi();
      }
    });
    this.lokacija.onUrlChange((v)=> {console.log(v)});
  }

  async dajMiFilm(idFilma : string){
    this.film = await this.filmoviServis.dajFilm(idFilma);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.naziv = "Film ne postoji!";
    for(let nazivAtributa in changes){
      if(nazivAtributa=="film") {
          if(this.film == null){
            return;
          } else {
            this.prikazi();
          }
      }
    }
  }

  prikazi(){
    if(this.film!=null){
      this.prikaziFilm(this.film);
    } else {
      this.naziv="Film ne postoji!";
    }

  }

  ngDoCheck(): void {
    if(this.film!=null){
      this.slika=environment.posteriPutanja+this.film.poster_putanja;
    } 
  }

  prikaziFilm(film : FilmoviBaza){
    
    let slika = <HTMLImageElement>document.getElementById('slika');
    slika.src = "https://www.themoviedb.org/t/p/w600_and_h900_bestv2" + film.poster_putanja;
    
    let h2 = <HTMLHeadingElement>document.querySelector("h1");
    h2.innerHTML = film.naziv_filma;

    let listaOcjena = <HTMLDListElement>document.getElementById('listaOcjena');
    listaOcjena.innerHTML = film.ocjena.toFixed(1).toString() + "/10";

    let datum = film.datum_premijere.toString().split('T');
    let podaci = datum[0].split('-');
    let listaGodina = <HTMLDListElement>document.getElementById('listaGodina');
    listaGodina.innerHTML = podaci[0];

    let listaTrajanje = <HTMLDListElement>document.getElementById('listaTrajanje');
    listaTrajanje.innerHTML = film.trajanje.toString() + " min";

    let listaStatus = <HTMLDListElement>document.getElementById('listaStatus');
    listaStatus.innerHTML = film.status;

    let listaJezik = <HTMLDListElement>document.getElementById('listaJezik');
    listaJezik.innerHTML = film.izvorni_jezik;

    let noviTagline = <HTMLParagraphElement>document.getElementById('noviTagline');
    noviTagline.innerHTML = film.tagline;
    
    let noviOpis = <HTMLParagraphElement>document.getElementById('noviOpis');
    noviOpis.innerHTML = film.radnja;

    let ostalo = <HTMLParagraphElement>document.getElementById('ostalo');

    let prikaz = "";
    prikaz += "Budžet: $" + film.budzet.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1.");
    //prikaz += film.budzet;
    prikaz += "<br>";
    prikaz += "Prihod: $" + film.prihod.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1.");
    //prikaz += film.prihod;
    if(film.radnja.length > 400){
      prikaz += "&nbsp&nbsp&nbsp&nbsp&nbsp Unio korisnik: ";
      prikaz += film.korisnik_id;
    }
    else {
      prikaz += "<br>";
      prikaz += "Unio korisnik: ";
      prikaz += film.korisnik_id;
    }

    ostalo.innerHTML = prikaz;
  }
}

