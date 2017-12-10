import { FormsModule } from '@angular/forms';
import { PersistenciaService } from './shared/persistencia.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js';
import { CampoCodigoComponent } from './shared/campo-codigo/campo-codigo.component';


@NgModule({
  declarations: [
    AppComponent,
    CampoCodigoComponent
  ],
  imports: [
    BrowserModule,
    HighlightJsModule,
    FormsModule
  ],
  providers: [PersistenciaService, HighlightJsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
