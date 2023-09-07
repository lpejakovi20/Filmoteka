import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FilmoviService } from '../servisi/filmovi.service';
import { FilmoviBaza } from '../servisi/FilmoviBaza';
import { KorisniciService } from '../servisi/korisnici.service';

@Component({
  selector: 'app-filmovi-pregled',
  templateUrl: './filmovi-pregled.component.html',
  styleUrls: ['./filmovi-pregled.component.scss']
})
export class FilmoviPregledComponent {

  filmovi = new Array<FilmoviBaza>();
  private sviFilmovi = new Array<FilmoviBaza>();
  prikazi: string = "";
  filter: string = "";

  @Output() prikaziDetalje = new EventEmitter<number>();

  constructor(private filmoviServis:FilmoviService, private korisniciServis: KorisniciService, private router: Router){

  }

  async ngOnInit() {
    await this.korisniciServis.dajUlogiranogKorisnika();
    if(this.korisniciServis.ulogaKorisnika!=1 && this.korisniciServis.ulogaKorisnika!=2){
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
    this.filmovi = await this.filmoviServis.dajFilmove(1);
    this.sviFilmovi=this.filmovi;
  }

  prikaziVise(idFilma: number) {
    this.prikaziDetalje.emit(idFilma);
  }


}
