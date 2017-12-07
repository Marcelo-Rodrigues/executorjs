import { PersistenciaService } from './shared/persistencia.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [PersistenciaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
