import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { NgForm } from '@angular/forms';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { KorisniciService } from '../servisi/korisnici.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

    url = environment.appServis;
    ime = <HTMLInputElement>document.getElementById("ime");
    prezime = <HTMLInputElement>document.getElementById("prezime");
    korime = <HTMLInputElement>document.getElementById("korime");
    lozinka = <HTMLInputElement>document.getElementById("lozinka");
    email = <HTMLInputElement>document.getElementById("email");

    constructor(private recaptchaV3Service: ReCaptchaV3Service, private korisniciServis: KorisniciService, private router: Router){
    }
    async ngOnInit() {
      await this.korisniciServis.dajUlogiranogKorisnika();
      if(this.korisniciServis.ulogaKorisnika!=1 && this.korisniciServis.ulogaKorisnika!=2){
        this.router.navigate(["/popis"]);
      }
      else{
        this.ime = <HTMLInputElement>document.getElementById("ime");
        this.prezime = <HTMLInputElement>document.getElementById("prezime");
        this.korime = <HTMLInputElement>document.getElementById("korime");
        this.lozinka = <HTMLInputElement>document.getElementById("lozinka");
        this.email = <HTMLInputElement>document.getElementById("email");
  
        this.prikazi();
      }
    }

  async azurirajPodatke(e: any) {
    let izrazIme = /^[A-Za-z\s]{1,50}$/
    let izrazPrezime = /^[A-Za-z\s]{1,100}$/
    let izrazLozinka = /^[A-Za-z\d@$!%*#?&]{3,20}$/

        if(!izrazIme.test(this.ime.value) || !izrazPrezime.test(this.prezime.value) || !izrazLozinka.test(this.lozinka.value)){
            alert("Neispravni podaci!");
        }
        else{

          this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
            console.debug("Token " + token + " generated");
          })
            let ime = <HTMLInputElement>document.getElementById("ime");
            let prezime = <HTMLInputElement>document.getElementById("prezime");
            let korime = <HTMLInputElement>document.getElementById("korime");
            let lozinka = <HTMLInputElement>document.getElementById("lozinka");
            let email = <HTMLInputElement>document.getElementById("email");

            this.korisniciServis.azurirajKorisnika(ime.value, prezime.value, korime.value, lozinka.value, email.value);

        };
  }
  
  async prikazi(){
    let parametri = { method: 'POST' }
    let odgovor = (await fetch(this.url + "profil", parametri)) as Response;
    console.log("ovo je odgovor sa statusom:" + odgovor.status);
    console.log(odgovor)
    if (odgovor.status == 200) {
        let podaci = await odgovor.text();
        podaci = JSON.parse(podaci);
        console.log("podaci o korisniku: ");
        console.log(podaci);
        this.prikaziKorisnika(podaci);
    } else if (odgovor.status == 401) {
        console.log("Neautorizirani pristup!");
    } else {
      console.log("Greška u dohvatu korisnika!");
    }
}
async prikaziKorisnika(korisnik : any){
  
  console.log("prikazi korisnika funkcija : ");
  console.log(korisnik);
  let ime = this.ime;
  ime.value = korisnik["ime"];

  this.prezime.value = korisnik.prezime;
  this.email.value = korisnik.email;
  this.korime.value = korisnik.korime;

  this.email.disabled = true;
  this.korime.disabled = true;    
}

}
