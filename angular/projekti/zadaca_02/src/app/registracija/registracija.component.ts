import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { KorisniciService } from '../servisi/korisnici.service';

import { NgForm } from '@angular/forms';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.scss']
})
export class RegistracijaComponent {

  url = environment.appServis;

  constructor(private korisniciServis : KorisniciService,private router : Router, 
    private recaptchaV3Service: ReCaptchaV3Service){
  }

  async onSubmit(e: any) {
    let ime = <HTMLInputElement>document.getElementById("ime");
    let prezime = <HTMLInputElement>document.getElementById("prezime");
    let korime = <HTMLInputElement>document.getElementById("korime");
    let lozinka = <HTMLInputElement>document.getElementById("lozinka");
    let email = <HTMLInputElement>document.getElementById("email");

    let izrazIme = /^[A-Za-z\s]{1,50}$/
    let izrazPrezime = /^[A-Za-z\s]{1,100}$/
    let izrazKorime = /^[A-Za-z\d]{6,30}$/
    let izrazLozinka = /^[A-Za-z\d@$!%*#?&]{3,20}$/
    let izrazEmail = /^[\w\d]{2,}@(\w{2,}\.){1,2}\w{2,}$/

    if(!izrazIme.test(ime.value) || !izrazPrezime.test(prezime.value) || !izrazKorime.test(korime.value) || 
    !izrazLozinka.test(lozinka.value) || !izrazEmail.test(email.value)){
        alert("Neispravan unos!");
        e.preventDefault();
    }
    else{

      this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
        console.debug("Token " + token + " generated");
      })
      
      let registriran = await this.korisniciServis.registriraj(ime.value, prezime.value, korime.value, lozinka.value, email.value);
      if(registriran){
        alert("Registracija uspješna!");
        this.router.navigate(['/','prijava']);
      }
      else{
        alert("Registracija nije uspjela!");
      }
    }
  }
}
