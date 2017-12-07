import { PersistenciaService } from './shared/persistencia.service';
import { Component, ElementRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('texto') texto: ElementRef;
  title = 'app';
  api;
  msgs: any[];
  envio: string;

  constructor(private persist: PersistenciaService) {
    this.api = this.persist.connect();
    this.api.subscribe((msgs: { msg: string }[]) => {
      console.log(msgs);
      const newline = String.fromCharCode(13, 10);
      if (msgs.map) {
        this.msgs = msgs.map(msg => msg.msg.replace(/\\n/g, newline).replace(/(^"|"$)/g, ''));
      } else {
        this.msgs = msgs;
      }
      console.log(this.msgs[0]);
    });
  }
  executar() {
    console.log('mandando');
    this.api.next(this.texto.nativeElement.value);
  }
}
