import { Component } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { KorisniciService } from '../servisi/korisnici.service';

import { NgForm } from '@angular/forms';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.component.html',
  styleUrls: ['./prijava.component.scss']
})


export class PrijavaComponent {

  url = environment.appServis;
  ulogaKorisnika?: any;

  constructor(private korisniciServis : KorisniciService, private router : Router,
     private recaptchaV3Service: ReCaptchaV3Service){
  }

  async onSubmit(e : any) {

    let korime = <HTMLInputElement>document.getElementById("korime");
    let lozinka = <HTMLInputElement>document.getElementById("lozinka");

    let izrazKorime = /^[A-Za-z\d]{3,30}$/
    let izrazLozinka = /^[A-Za-z\d@$!%*#?&]{3,20}$/

    if(korime!=null && lozinka!=null){
      if(!izrazKorime.test(korime.value) || !izrazLozinka.test(lozinka.value)){
        alert("Neispravan unos!");
        e.preventDefault();
      }
      else{

        this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
          console.debug("Token " + token + " generated");
        })

        let korisnik = await this.korisniciServis.prijavi(korime.value, lozinka.value);
        if(korisnik!=null){
          this.ulogaKorisnika = korisnik.tip_korisnika_id;
          this.router.navigate(['/','popis']).then(() => {
            window.location.reload();
          });
        }
        else{
          alert("Ne postoji korisnik s navedenim podacima!");
        }
      }
    }
  }
}
