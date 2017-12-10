import { PersistenciaService } from './shared/persistencia.service';
import { Component } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  api;
  msgs: string[];
  codigo = '';

  private assinatura: Subscription;

  constructor(private persist: PersistenciaService) {

    this.assinatura = this.persist.mensagem.subscribe((msgs) => {
      console.log(msgs);
      const newline = String.fromCharCode(13, 10);
      // if (msgs.map) {
      //   this.msgs = msgs.map(msg => msg.msg.replace(/\\n/g, newline).replace(/(^"|"$)/g, ''));
      // } else {
      this.msgs = msgs.map(msg => msg.msg);
      // }
      console.log(this.msgs);
    });
  }
  executar() {
    console.log('mandando', this.codigo);
    this.persist.mensagem.next([{ msg: this.codigo }]);
    this.codigo = '';
  }
}
