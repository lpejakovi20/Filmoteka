import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module} from 'ng-recaptcha';

import { AppComponent } from './app.component';
//import { PopisFilmovaComponent } from './popis-filmova/popis-filmova.component';
//import { DetaljiFilmaComponent } from './detalji-filma/detalji-filma.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router'
import { PopisZanrovaSFilmovimaComponent } from './popis-zanrova-s-filmovima/popis-zanrova-s-filmovima.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { ProfilComponent } from './profil/profil.component';
import { FilmoviPregledComponent } from './filmovi-pregled/filmovi-pregled.component';
import { DetaljiFilmaComponent } from './detalji-filma/detalji-filma.component';
import { FilmoviPrijedloziComponent } from './filmovi-prijedlozi/filmovi-prijedlozi.component';
import { FilmoviPretrazivanjeComponent } from './filmovi-pretrazivanje/filmovi-pretrazivanje.component';
import { ZanroviComponent } from './zanrovi/zanrovi.component';
import { environment } from '../environments/environment';
import { DokumentacijaComponent } from './dokumentacija/dokumentacija.component';

const routes:Routes = [
  {path: "popis", component:PopisZanrovaSFilmovimaComponent},
  {path : "prijava", component:PrijavaComponent},
  {path : "registracija", component:RegistracijaComponent},
  {path : "profil", component:ProfilComponent},
  {path : "filmoviPregled", component:FilmoviPregledComponent},
  {path: "detalji/:id", component:DetaljiFilmaComponent},
  {path : "filmoviPrijedlozi", component:FilmoviPrijedloziComponent},
  {path : "filmoviPretrazivanje",component:FilmoviPretrazivanjeComponent},
  {path : "zanrovi",component:ZanroviComponent},
  {path : "dokumentacija",component:DokumentacijaComponent},
  {path: "", redirectTo:"popis", pathMatch:"full"}
];

@NgModule({
  declarations: [
    AppComponent,
    PopisZanrovaSFilmovimaComponent,
    PrijavaComponent,
    RegistracijaComponent,
    ProfilComponent,
    FilmoviPregledComponent,
    DetaljiFilmaComponent,
    FilmoviPrijedloziComponent,
    FilmoviPretrazivanjeComponent,
    ZanroviComponent,
    DokumentacijaComponent
  ],
  imports: [
    BrowserModule,FormsModule,RouterModule.forRoot(routes),RecaptchaV3Module
  ],
  providers: [{provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.siteKey}],
  bootstrap: [AppComponent]
})
export class AppModule { }
