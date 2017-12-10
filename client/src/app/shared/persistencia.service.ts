import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromEvent';

@Injectable()
export class PersistenciaService {

  private socket: SocketIOClient.Socket;
  public readonly mensagem: Subject<{ msg: string }[]>;

  constructor() {
    this.socket = io(`http://localhost:3000`);
    this.mensagem = this.obterControleEvento('message');
  }

  private obterControleEvento(evento: string): Subject<any> {

    const observavelMensagem = new Observable(o => {
      this.socket.on(evento, (data) => {
        o.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });

    const observadorMensagem = {
      next: (data: Object) => {
        this.socket.emit(evento, data);
      },
    };

    return Subject.create(observadorMensagem, observavelMensagem);
  }

}
