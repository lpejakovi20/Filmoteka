import { Component } from '@angular/core';
import { ZanroviService } from '../servisi/zanrovi.service';
import { ZanroviBaza } from '../servisi/ZanroviBaza';
import { environment } from '../../environments/environment';
import { KorisniciService } from '../servisi/korisnici.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-zanrovi',
  templateUrl: './zanrovi.component.html',
  styleUrls: ['./zanrovi.component.scss']
})
export class ZanroviComponent {
  zanrovi = new Array<ZanroviBaza>;
  zanroviTMDB? : any;
  kolekcija :any[]= [];

  url = environment.restServis;
  urlApp = environment.appServis;

  constructor(private zanroviServis : ZanroviService, private korisniciServis: KorisniciService, private router : Router){
    
  }

  async ngOnInit() {
    await this.korisniciServis.dajUlogiranogKorisnika();
    if(this.korisniciServis.ulogaKorisnika!=1){
      this.router.navigate(["/popis"]);
    }
    else{
      this.dohvatiZanrove();
      if(this.zanrovi.length == 0)
      setTimeout(this.dohvatiZanrove.bind(this),3000);
    }
  }

  trackByFn(index : number, object:any){
    return object.id;
  }

  async dohvatiZanrove() {
    await this.zanroviServis.osvjeziZanrove();
    this.zanrovi = this.zanroviServis.dajZanrove();

    await this.dohvatiZanroveTMDB();
  }

  async azurirajZanr(id: number){
    let inputElement = <HTMLInputElement>document.querySelector("#zanr" + id);
    let naziv = inputElement.value;
    let izraz = /^[A-Za-z\s]{1,45}$/
    if(izraz.test(naziv)){
      
        let odgovor = await this.zanroviServis.azurirajZanr(id,naziv);
        if (odgovor.status == 200) {
            let podaci = await odgovor.text();
            let nazivElement = <HTMLTableCellElement>document.querySelector("[id='naziv" + id + "']");
            nazivElement.innerHTML = naziv;
            console.log(podaci);
        }
    }
    else{
        alert("Neispravan unos!");
    }
  }

  async obrisiZanrove(){
      let o = await this.zanroviServis.obrisiZanrove();
        if(o.status == 200){
          alert("Obrisani svi žanrovi koji nemaju niti jedan film!");
          this.dohvatiZanrove();
        }
        else{
          alert("Brisanje žanrova nije uspjelo!");
        }
  }

  async dohvatiZanroveTMDB(){
    
    let zanrovi = await this.zanroviServis.dohvatiZanroveTMDB();
    if(zanrovi!=null){
      this.zanroviTMDB = zanrovi.genres;

      for(let z of this.zanroviTMDB){
        this.kolekcija.push(z);
      }
    }
  }

  oznaciSve(){
    var cboxes = document.querySelectorAll('input[type="checkbox"]');
    for (var i=0;i<cboxes.length;i++) {
          let cbox = <HTMLInputElement>cboxes[i];
            cbox.checked= true;
    }
  }

  dajListuZanrova() : Array<any>{
    let listaZanrova = [];
    var cboxes = document.querySelectorAll('input[type="checkbox"]');
    for (var i=0;i<cboxes.length;i++) {
      let cbo = <HTMLInputElement>cboxes[i];
        if(cbo.checked == true){
            let obj = {
              id : cbo.value,
              name : cbo.id
            };
            listaZanrova.push(obj);
        }
    }
    return listaZanrova;
  }

  async dodajUbazu(){
    let par1 = <HTMLParagraphElement>document.querySelector("#unos");
    let par2 = <HTMLParagraphElement>document.querySelector("#preskoceni");
    let listaZanrova = [];

    listaZanrova = this.dajListuZanrova();
    console.log(listaZanrova);

    let postoji;
    let obavijest = "Preskočeni(postojeći) žanrovi:\n";
        for(let p of listaZanrova){
            postoji = false;
            for(let z of this.zanrovi){
                if(z["id"].toString() == p["id"]){
                    postoji = true;
                    obavijest += z["naziv"] + ", ";
                }
            }
            if(!postoji){
              this.zanroviServis.dodajUbazu(p);
            }
            
        }
            
      par1.innerHTML = "Odabrani žanr(ovi) uspješno dodani u bazu!"; 

      par2.innerHTML = obavijest;
      this.dohvatiZanrove();
  }
}
