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
  msgs: string[] = [];
  codigo = '';

  private assinatura: Subscription;

  constructor(private persist: PersistenciaService) {

    this.persist.test.obterTodos().then(
      (tests) => {
        this.msgs = tests.map((test) => test.codigo);
      });

    this.persist.test.receberNovo.subscribe(
      (test) => {
        this.msgs.push(test.codigo);
      });
  }

  executar() {
    this.persist.test.enviarNovo.next({ codigo: this.codigo });
    this.codigo = '';
  }
}
